package com.example.producerconsumerBackend.Controller;

import java.util.ArrayList;

public class SnapShot {
    private ArrayList<Object> network;

    //constructor
    public SnapShot(ArrayList<Object> network){
        this.network = network;
    }
    //functions
    //to get what is in the network (products)
    public ArrayList<Object> getNetwork() {
        return this.network;
    }
}