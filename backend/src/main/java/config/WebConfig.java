package config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        // Frontend URLs allowed to access the backend
                        .allowedOrigins(
                                "http://localhost:5173",   // React dev server
                                "http://127.0.0.1:5173",   // Sometimes vite runs here
                                "https://mybankapp.com"    // Your production frontend domain
                        )
                        // Methods allowed
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        // Allow credentials (cookies, JWT in headers)
                        .allowCredentials(true)
                        // Allow all headers (Authorization, Content-Type, etc.)
                        .allowedHeaders("*")
                        // Expose headers (optional, useful for JWT tokens, pagination, etc.)
                        .exposedHeaders("Authorization", "Content-Disposition");
            }
        };
    }
}
