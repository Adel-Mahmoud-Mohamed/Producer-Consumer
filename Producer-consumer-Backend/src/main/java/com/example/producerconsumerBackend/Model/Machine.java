package com.example.producerconsumerBackend.Model;

import com.example.producerconsumerBackend.Controller.MachineObserver;
import com.example.producerconsumerBackend.Controller.Manager;
import com.example.producerconsumerBackend.Controller.Network;
import javassist.expr.NewArray;

import java.util.ArrayList;
import java.util.concurrent.ThreadLocalRandom;

public class Machine {

    private String name;
    private Product product;
    private long serviceTime;
    private ArrayList<Queue> prevQueues;
    private ArrayList<Queue> nextQueues;
    private boolean isconsumed = false;
    private Manager manager;
    private Thread produceThread;
    private Thread consumeThread;

    private final Object object = new Object();

    public Machine(String name) {
        this.name = name;
        this.serviceTime = ThreadLocalRandom.current().nextInt(500, 6000);
        this.manager = Manager.getInstance();
        manager.addObserver(this.name, new MachineObserver(this.name));
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Product getProduct() {
        return this.product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public long getServiceTime() {
        return this.serviceTime;
    }

    public void setServiceTime(long serviceTime) {
        this.serviceTime = serviceTime;
    }

    public ArrayList<Queue> getPrevQueues() {
        return this.prevQueues;
    }

    public void setPrevQueues(ArrayList<Queue> prevQueues) {
        this.prevQueues = prevQueues;
    }

    public ArrayList<Queue> getNextQueues() {
        return this.nextQueues;
    }

    public void setNextQueues(ArrayList<Queue> nextQueues) {
        this.nextQueues = nextQueues;
    }

    public Machine copy(){
        Machine newMachine = new Machine(this.name);
        newMachine.product = this.product;
        newMachine.serviceTime = this.serviceTime;
        newMachine.isconsumed = this.isconsumed;
        return newMachine;
    }

    public void active(Queue prevQueue, Queue nextQueue, Network network){
        Runnable consumer = () -> {
            System.out.println("inside active consumer");
            while (!consumeThread.isInterrupted()) {
                synchronized (object) {
                    try {
                        while (prevQueue.getProducts().isEmpty()) {
                            manager.notify(this.name, network);
                            object.wait();
                        }
                        this.setProduct(prevQueue.dequeue(network));
                        manager.notify(this.name, network);
                        isconsumed = true;
                        object.wait();
                        object.notifyAll();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
                if(network.stop) {
                    this.consumeThread.interrupt();
                }
            }
        };

        Runnable producer = () -> {
            while (!produceThread.isInterrupted()) {
                System.out.println("inside active producer");
                synchronized (object) {
                    try {
                        if (!prevQueue.getProducts().isEmpty() && !isconsumed) {
                            object.notifyAll();
                        }
                        while (isconsumed && product != null) {
                            Thread.sleep(serviceTime);
                            nextQueue.enqueue(product, network);
                            object.notifyAll();
                            this.setProduct(null);
                            isconsumed = false;
                            object.wait();
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
                if(network.stop) {
                    this.produceThread.interrupt();
                }
            }
        };
        this.produceThread = new Thread(producer);
        this.consumeThread = new Thread(consumer);
        produceThread.start();
        consumeThread.start();
    }
}
