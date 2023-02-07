package com.example.producerconsumerBackend.Controller;

public class QueueObserver implements IObserver {
    public QueueObserver(){}

    public void update(Network network){
        network.setChange(true);
    }
    public void update(){}
}
