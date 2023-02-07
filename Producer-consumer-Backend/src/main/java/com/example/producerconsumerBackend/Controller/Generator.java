package com.example.producerconsumerBackend.Controller;

import java.util.ArrayList;

public class Generator {
    //params
    private ArrayList<Object> network;
    //functions
    //setters & getters
    public void setNetwork(ArrayList<Object> network){this.network=network;}

    public ArrayList<Object> getNetwork(){
        return this.network;
    }

    //saving the current network
    public SnapShot savingNetwork()
    {
        return new SnapShot(this.network);
    }

    //loading the network
    public void GetFromMem(SnapShot memento){
        this.network=memento.getNetwork();
    }
}