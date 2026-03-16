package ca.uoguelph.socs.cis3760.icav;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@SpringBootApplication
@RestController
public class IcavApplication {

    public static void main(String[] args) {
        SpringApplication.run(IcavApplication.class, args);
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}
