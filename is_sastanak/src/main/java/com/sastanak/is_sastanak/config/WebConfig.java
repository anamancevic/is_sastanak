package com.sastanak.is_sastanak.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
        private final AutorizacijaInterceptor autorizacijaInterceptor;

    public WebConfig(AutorizacijaInterceptor autorizacijaInterceptor) {
        this.autorizacijaInterceptor = autorizacijaInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
       registry.addInterceptor(autorizacijaInterceptor)
               .addPathPatterns("/api/**");
    }
}
