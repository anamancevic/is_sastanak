package com.sastanak.is_sastanak.config;

import com.sastanak.is_sastanak.users.model.Korisnik;
import com.sastanak.is_sastanak.users.model.Uloga;
import com.sastanak.is_sastanak.users.repository.KorisnikRepository;
import com.sastanak.is_sastanak.users.repository.KorisnikUlogaRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.List;

@Component
public class AutorizacijaInterceptor implements HandlerInterceptor {
    private final KorisnikRepository korisnikRepository;
    private final KorisnikUlogaRepository korisnikUlogaRepository;

    public AutorizacijaInterceptor(KorisnikRepository korisnikRepository,
                                   KorisnikUlogaRepository korisnikUlogaRepository) {
        this.korisnikRepository = korisnikRepository;
        this.korisnikUlogaRepository = korisnikUlogaRepository;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
                             Object handler) throws Exception {
        String putanja = request.getRequestURI();
        String metoda = request.getMethod();

        if (metoda.equals("OPTIONS")) {
            return true;
        }

        // da li je OSETLJIVA putanja (menja podatke)?
        boolean osetljiva =
                (putanja.equals("/api/korisnici") && metoda.equals("POST")) ||
                        (putanja.equals("/api/korisnici/dodeli-ulogu") && metoda.equals("POST")) ||
                        (putanja.equals("/api/sastanci") && metoda.equals("POST")) ||
                        (putanja.equals("/api/sastanci/dodaj-ucesnika") && metoda.equals("POST")) ||
                        (putanja.equals("/api/sastanci/evidentiraj-prisustvo") && metoda.equals("POST")) ||
                        (putanja.equals("/api/predlozi") && metoda.equals("POST")) ||
                        (putanja.matches("/api/sastanci/\\d+/status") && metoda.equals("PUT"));

        // ako NIJE osetljiva (GET pregledi, login...) - propusti bez provere
        if (!osetljiva) {
            return true;
        }

        // osetljiva je - traži header i proveri pravo
        String korisnickoIme = request.getHeader("X-Korisnik");
        if (korisnickoIme == null || korisnickoIme.isEmpty()) {
            response.setStatus(401);
            return false;
        }

        Korisnik korisnik = korisnikRepository.findByKorisnickoIme(korisnickoIme).orElse(null);
        if (korisnik == null) {
            response.setStatus(401);
            return false;
        }

        List<String> uloge = korisnikUlogaRepository.findByKorisnikId(korisnik.getId())
                .stream()
                .map(ku -> ku.getUloga().getNaziv())
                .toList();

        // kreiranje korisnika - admin
        if (putanja.equals("/api/korisnici") && metoda.equals("POST")) {
            if (!uloge.contains("administrator")) { response.setStatus(403); return false; }
        }
        // dodela uloge - admin
        if (putanja.equals("/api/korisnici/dodeli-ulogu") && metoda.equals("POST")) {
            if (!uloge.contains("administrator")) { response.setStatus(403); return false; }
        }
        // zakazivanje - rukovodilac ili admin
        if (putanja.equals("/api/sastanci") && metoda.equals("POST")) {
            if (!uloge.contains("rukovodilac") && !uloge.contains("administrator")) { response.setStatus(403); return false; }
        }
        // dodavanje ucesnika - rukovodilac ili admin
        if (putanja.equals("/api/sastanci/dodaj-ucesnika") && metoda.equals("POST")) {
            if (!uloge.contains("rukovodilac") && !uloge.contains("administrator")) { response.setStatus(403); return false; }
        }
        // prisustvo - rukovodilac, zapisnicar ili admin
        if (putanja.equals("/api/sastanci/evidentiraj-prisustvo") && metoda.equals("POST")) {
            if (!uloge.contains("rukovodilac") && !uloge.contains("zapisnicar") && !uloge.contains("administrator")) { response.setStatus(403); return false; }
        }
        // izmena statusa - rukovodilac, zapisnicar ili admin
        if (putanja.matches("/api/sastanci/\\d+/status") && metoda.equals("PUT")) {
            if (!uloge.contains("rukovodilac") && !uloge.contains("zapisnicar") && !uloge.contains("administrator")) { response.setStatus(403); return false; }
        }
        // predlozi - zapisnicar ili admin
        if (putanja.equals("/api/predlozi") && metoda.equals("POST")) {
            if (!uloge.contains("zapisnicar") && !uloge.contains("administrator")) { response.setStatus(403); return false; }
        }

        return true;
    }
}
