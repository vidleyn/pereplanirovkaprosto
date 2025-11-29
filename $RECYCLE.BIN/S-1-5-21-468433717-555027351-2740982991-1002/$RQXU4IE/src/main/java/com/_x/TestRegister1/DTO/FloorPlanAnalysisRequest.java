package com._x.TestRegister1.DTO;

import org.springframework.web.multipart.MultipartFile;

public class FloorPlanAnalysisRequest {

    private MultipartFile file;

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }
}
