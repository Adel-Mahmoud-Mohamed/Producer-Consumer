package com.example.producerconsumerBackend.Controller;


import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.TypeFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;

@Component
@RestController
@CrossOrigin("http://localhost:4200")
public class RequestsController {
    Network network ;
    boolean start = false;
    ArrayList<HashMap<String, String[]>> newProductsNetwork = new ArrayList<>();

    @PostMapping("/constructNetwork")
    String constructNetwork(@RequestBody String productsNetwork){
        System.out.println("hello from generate network");
        network = new Network();

        try {
            if (this.newProductsNetwork.size() > 1) {
                this.newProductsNetwork = new ArrayList<>();
            }

            TypeFactory factory = TypeFactory.defaultInstance();
            ObjectMapper map = new ObjectMapper();
            this.newProductsNetwork.add(map.readValue(productsNetwork, new TypeReference<HashMap<String, String[]>>() {}));


            if (this.newProductsNetwork.size() == 2) {
                network.initialize(newProductsNetwork.get(0), newProductsNetwork.get(1));
            }

            return ("Network Generated Successfully");
        }catch (Exception e){
            e.printStackTrace();
            return(e.getMessage());
        }
    }
    @GetMapping("/run")
    String run(){
        try {
            network.play();
            return ("System Activated Successfully");
        }catch (Exception e){
            return (e.getMessage());
        }
    }

    @GetMapping("/polling")
    ArrayList<Object> polling(){
        System.out.println();
        ArrayList<Object> x = network.getNetwork();
        //System.out.println(x);
        return x;
    }

    @GetMapping("/replay")
    ArrayList<ArrayList<Object>> replay(){
        return network.replay();
    }

    @GetMapping("/stop")
    String stop(){
        network.stop();
        start = false;
        return ("System Stopped Successfully");
    }

    @GetMapping("/inputStop")
    String inputStop(){
        network.inputStop();
        return ("input Stopped Successfully");
    }
}