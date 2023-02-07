package com.example.producerconsumerBackend.Model;

import com.example.producerconsumerBackend.Controller.Network;

import java.util.concurrent.ThreadLocalRandom;

public class InputThread {

    private Thread inputThread;

    public void addProduct(Queue queue, Network network){
        Runnable input = () -> {
            int products = ThreadLocalRandom.current().nextInt(40, 600);
            int check = 0;
            while(!inputThread.isInterrupted()){
                synchronized (this){
                    try{
                        if(check > products)
                            break;
                        long rate = ThreadLocalRandom.current().nextInt(300, 1000);
                        queue.getProducts().add(new Product());
                        Thread.sleep(rate);
                        check++;
                    }
                    catch (Exception e){
                        System.out.println();
                    }
                }
                if(network.inputStop){
                    this.inputThread.interrupt();
                }
            }
        };
        this.inputThread = new Thread(input);
        this.inputThread.start();
    }
}

