package com._x.TestRegister1.Repository;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public class MultipartInputStreamFileResource extends ByteArrayResource {
    private final String filename;

    public MultipartInputStreamFileResource(MultipartFile file)
    throws IOException
    {
        super(file.getBytes());
        this.filename = file.getOriginalFilename();
    }
    @Override
    public String getFilename() {
        return this.filename;
    }
}
