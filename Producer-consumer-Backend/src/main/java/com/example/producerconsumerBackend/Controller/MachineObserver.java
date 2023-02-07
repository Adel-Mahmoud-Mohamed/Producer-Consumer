package com.example.producerconsumerBackend.Controller;

public class MachineObserver implements IObserver {
    private String machineName;
    public MachineObserver(String machineName){
        this.machineName = machineName;
    }

    public void update(Network network){
        network.setChange(true);
    }

    public void update(){
    }
}
