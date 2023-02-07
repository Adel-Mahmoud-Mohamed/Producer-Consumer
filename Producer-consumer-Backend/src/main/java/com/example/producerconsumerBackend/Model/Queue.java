package com.example.producerconsumerBackend.Model;

import com.example.producerconsumerBackend.Controller.Manager;
import com.example.producerconsumerBackend.Controller.Network;
import com.example.producerconsumerBackend.Controller.QueueObserver;

import java.util.ArrayList;

public class Queue {
    private ArrayList<Product> products;
    private String queueID;
    private Manager manager;
    private int size;

    public Queue(String queueID){
        this.products = new ArrayList<>();
        this.queueID = queueID;
        this.manager = Manager.getInstance();
        this.manager.addObserver(this.queueID, new QueueObserver());
    }

    public synchronized ArrayList<Product> getProducts() {
        synchronized (this){
            return this.products;
        }
    }

    public void setProducts(ArrayList<Product> products) {
        this.products = products;
    }

    public String getQueueID() {
        return queueID;
    }

    public void setQueueID(String queueID) {
        this.queueID = queueID;
    }

    public int getSize() {
        return this.products.size();
    }

    public void setSize(int size) {
        this.size = size;
    }

    public Queue copy(){
        Queue newQueue = new Queue(this.queueID);
        for(Product pro : this.products){
            newQueue.products.add(pro.copy());
        }
        newQueue.size = this.size;
        return newQueue;
    }

    public synchronized void enqueue(Product product, Network network) throws Exception{
        synchronized (this){
            this.products.add(product);
            this.manager.notify(this.queueID, network);
            this.notify();
        }
    }

    public Product dequeue(Network network) throws Exception{
        synchronized (this){
            while(this.products.size() == 0) this.wait();
            this.manager.notify(this.queueID, network);
            return this.products.remove(0);
        }
    }



}
