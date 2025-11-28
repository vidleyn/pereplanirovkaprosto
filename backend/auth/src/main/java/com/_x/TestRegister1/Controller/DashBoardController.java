package com._x.TestRegister1.Controller;

import com._x.TestRegister1.Models.User;
import com._x.TestRegister1.Repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.security.Principal;

@Controller
public class DashBoardController {
    private final UserRepository repository;

    public DashBoardController(UserRepository repository) {
        this.repository = repository;
    }
    @GetMapping("/dashboard")
    public String dashboard(Model model, Principal principal) {
//        if (principal == null) {
//            return "redirect:/auth/login";
//        }

        String username = principal.getName();
        User user = repository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        model.addAttribute("user", user);
        return "dashboard";  // ← dashboard.html (или переименуй в user.html)
    }
}
