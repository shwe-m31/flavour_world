package com.pantrylabel.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String name;
    private String gender;
    private Integer age;
    private String kitchenType;
    private Long stateId;
    private String stateName;
    private boolean profileCompleted;
}
