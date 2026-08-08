package com.sastanak.is_sastanak;

import com.sastanak.is_sastanak.users.model.Korisnik;
import com.sastanak.is_sastanak.users.model.OrganizacionaCelina;
import com.sastanak.is_sastanak.users.repository.KorisnikRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final KorisnikRepository korisnikRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(KorisnikRepository korisnikRepository, PasswordEncoder passwordEncoder) {
        this.korisnikRepository = korisnikRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (korisnikRepository.findByKorisnickoIme("admin").isEmpty()) {
            Korisnik admin = new Korisnik();
            admin.setIme("Admin");
            admin.setPrezime("Administrator");
            admin.setJmbg("0000000000000");
            admin.setKorisnickoIme("admin");
            admin.setLozinkaHash(passwordEncoder.encode("admin123"));

            OrganizacionaCelina celina = new OrganizacionaCelina();
            celina.setId(1);
            admin.setOrganizacionaCelina(celina);

            korisnikRepository.save(admin);
            System.out.println(">>> Admin korisnik napravljen (admin / admin123)");
        }
    }
}