package com._x.TestRegister1.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;

public class FloorPlanAnalysisResponse {
    private String status;

    @JsonProperty("blueprint3d")
    private Map<String, Object> blueprint3d;

    private Statistics statistics;

    public Statistics getStatistics() {
        return statistics;
    }

    public void setStatistics(Statistics statistics) {
        this.statistics = statistics;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Map<String, Object> getBlueprint3d() {
        return blueprint3d;
    }

    public void setBlueprint3d(Map<String, Object> blueprint3d) {
        this.blueprint3d = blueprint3d;
    }

    public static class Statistics {
        private int corners;
        private int walls;
        private int rooms;

        public int getCorners() {
            return corners;
        }

        public void setCorners(int corners) {
            this.corners = corners;
        }

        public int getWalls() {
            return walls;
        }

        public void setWalls(int walls) {
            this.walls = walls;
        }

        public int getRooms() {
            return rooms;
        }

        public void setRooms(int rooms) {
            this.rooms = rooms;
        }
    }
}
