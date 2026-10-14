package com.pantrylabel.service.impl;

import com.pantrylabel.dto.request.ProfileRequest;
import com.pantrylabel.dto.response.UserDto;
import com.pantrylabel.entity.Address;
import com.pantrylabel.entity.State;
import com.pantrylabel.entity.User;
import com.pantrylabel.exception.ResourceNotFoundException;
import com.pantrylabel.mapper.DtoMapper;
import com.pantrylabel.repository.AddressRepository;
import com.pantrylabel.repository.StateRepository;
import com.pantrylabel.repository.UserRepository;
import com.pantrylabel.service.ProfileService;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository users;
    private final StateRepository states;
    private final AddressRepository addresses;
    private final DtoMapper mapper;

    public ProfileServiceImpl(UserRepository users,
                              StateRepository states,
                              AddressRepository addresses,
                              DtoMapper mapper) {
        this.users = users;
        this.states = states;
        this.addresses = addresses;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getProfile(String email) {
        return mapper.user(user(email));
    }

    @Override
    @Transactional
    public UserDto saveProfile(String email, ProfileRequest request) {
        User user = user(email);

        user.setName(request.getName());
        user.setGender(request.getGender());
        user.setAge(request.getAge());

        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            user.setPhone(request.getPhone().trim());
        }

        if (request.getAddress() != null && !request.getAddress().isBlank()) {
            user.setAddress(request.getAddress().trim());
        }

        if (request.getKitchenType() != null) {
            user.setKitchenType(request.getKitchenType());
        }

        if (request.getStateId() != null) {
            states.findById(request.getStateId()).ifPresent(user::setState);
        }

        user.setProfileCompleted(true);
        User savedUser = users.save(user);

        // Persist address into addresses table so it is exposed to checkout automatically
        if (request.getAddress() != null && !request.getAddress().isBlank()) {
            List<Address> existingAddrs = addresses.findByUserId(savedUser.getId());
            if (existingAddrs.isEmpty()) {
                Address addr = Address.builder()
                        .user(savedUser)
                        .name(savedUser.getName() != null ? savedUser.getName() : "Customer")
                        .phone(savedUser.getPhone() != null ? savedUser.getPhone() : "+91 9840100000")
                        .flatHouseNo(request.getAddress().trim())
                        .areaStreetName(request.getAddress().trim())
                        .landmark("")
                        .city("City")
                        .state(savedUser.getState() != null ? savedUser.getState().getName() : "Tamil Nadu")
                        .pincode("600001")
                        .build();
                addresses.save(addr);
            } else {
                Address addr = existingAddrs.get(0);
                addr.setFlatHouseNo(request.getAddress().trim());
                addr.setAreaStreetName(request.getAddress().trim());
                if (savedUser.getPhone() != null) {
                    addr.setPhone(savedUser.getPhone());
                }
                addresses.save(addr);
            }
        }

        return mapper.user(savedUser);
    }

    private User user(String email) {
        return users.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
