package com._x.TestRegister1.Service;

import com._x.TestRegister1.DTO.FloorPlanAnalysisResponse;
import com._x.TestRegister1.Repository.MultipartInputStreamFileResource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class FloorApiClient {

    private final RestTemplate restTemplate;

    @Value("${floorplan.api.url:http://localhost:8000}")
    private String apiBaseUrl;

    public FloorApiClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public boolean isHealthy() {
        try {
            String url = apiBaseUrl + "/health";
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            return response.getStatusCode() == HttpStatus.OK;
        } catch (Exception e) {
            return false;
        }
    }

    public FloorPlanAnalysisResponse analyzeFloorPlan(MultipartFile file
    ) throws IOException {
        if (!isHealthy()) {
            throw new RuntimeException("Сервис недоступен");
        }
        String url = apiBaseUrl + "/analyze";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new MultipartInputStreamFileResource(file));

        HttpEntity<MultiValueMap<String, Object>> requestEntity =
                new HttpEntity<>(body, headers);


        try {
            ResponseEntity<FloorPlanAnalysisResponse> response = restTemplate.postForEntity(
                    url,
                    requestEntity,
                    FloorPlanAnalysisResponse.class
            );
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Ошибка связи с сервисом анализа: " + e.getMessage());
        }
    }
    }
