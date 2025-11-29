package com._x.TestRegister1.Controller;

import com._x.TestRegister1.Service.FloorApiClient;
import com._x.TestRegister1.DTO.FloorPlanAnalysisResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/floorplan")
public class FloorPlanController {
    private final FloorApiClient floorApiClient;
    private static final Logger log= LoggerFactory.getLogger(FloorPlanController.class);


    public FloorPlanController(FloorApiClient floorApiClient) {
        this.floorApiClient = floorApiClient;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String,String>> checkHealth(){
        Map<String,String> response=new HashMap<>();
        boolean healthy=floorApiClient.isHealthy();

        if (healthy) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(response);
        }

    }
    @PostMapping("/analyze")
    public ResponseEntity<Map<String,Object>> analyzeFloorPlan(
            @RequestParam("file") MultipartFile file
    ) {
        log.info("Получен запрос на анализ планировки: {}", file.getOriginalFilename());

        Map<String, Object> errorResponse = new HashMap<>();
        if (file.isEmpty()) {
            errorResponse.put("status", "error");
            errorResponse.put("message", "Файл не может быть пустым");
            return ResponseEntity.badRequest()
                    .body(errorResponse);
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            errorResponse.put("status", "error");
            errorResponse.put("message", "Файл должен быть изображением (JPG, PNG)");
            return ResponseEntity.badRequest()
                    .body(errorResponse);
        }

        try {
            FloorPlanAnalysisResponse response = floorApiClient.analyzeFloorPlan(file);

            log.info("Анализ завершен. Комнат: {}, Стен: {}, Углов: {}",
                    response.getStatistics().getRooms(),
                    response.getStatistics().getWalls(),
                    response.getStatistics().getCorners());

            Map<String, Object> result = new HashMap<>();
            result.put("status", response.getStatus());
            result.put("blueprint3d", response.getBlueprint3d());
            result.put("statistics", response.getStatistics());

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error("Ошибка при анализе: {}", e.getMessage(), e);
            errorResponse.put("status", "error");
            errorResponse.put("message", "Ошибка при анализе планировки: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }
    }

