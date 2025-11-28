package com._x.TestRegister1.Controller;

import com._x.TestRegister1.DTO.RegisterRequest;
import com._x.TestRegister1.DTO.ResponseDto;
import com._x.TestRegister1.Models.User;
import com._x.TestRegister1.Repository.UserRepository;
import com._x.TestRegister1.Service.AuthService;
import jakarta.validation.Valid;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }


    @GetMapping("/")
    public String authRoot() {
        return "redirect:/auth/login";
    }


    @GetMapping("/register")
    public String showRegisterForm(Model model) {
        model.addAttribute("registerRequest", new RegisterRequest());
        return "register";
    }

    @PostMapping("/register")
    public String registerUser(
            @Valid @ModelAttribute("registerRequest") RegisterRequest request,
            BindingResult bindingResult,
            Model model,
            RedirectAttributes redirectAttributes
    ) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("registerRequest", request);
            return "register";
        }
        try {
            ResponseDto response = authService.registerUser(request);
            redirectAttributes.addFlashAttribute("successMessage", response.message());
            return "redirect:/auth/user";
        } catch (Exception e) {
            model.addAttribute("errorMessage", e.getMessage());
            model.addAttribute("registerRequest", request);
            return "register";
        }
    }

    @GetMapping("/success")
    public String successPage(
            @RequestParam(required = false) String username,
            Model model
    ) {
        model.addAttribute("username", username);
        return "success";
    }

    @GetMapping("/login")
    public String loginPage(){
        return "login";
    }

    @GetMapping("/user")
    public String homepage(){
        return "user";
    }

    private Map<String, String> getValidationErrors(BindingResult bindingResult) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : bindingResult.getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        return errors;
    }

    //FloorApiClient


}