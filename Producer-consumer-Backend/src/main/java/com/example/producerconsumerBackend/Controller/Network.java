package com.example.producerconsumerBackend.Controller;

import com.example.producerconsumerBackend.Model.InputThread;
import com.example.producerconsumerBackend.Model.Machine;
import com.example.producerconsumerBackend.Model.Product;
import com.example.producerconsumerBackend.Model.Queue;

import java.util.ArrayList;
import java.util.HashMap;

public class Network {


    //params
    private ArrayList<Machine> machines;
    private HashMap<String, Queue> bufferQueues;
    private CareTaker careTaker;
    private Generator orginator;

    private boolean onChange = false;
    public boolean stop = false;
    public boolean inputStop = false;

    public ArrayList<Machine> getMachines() {
        return this.machines;
    }

    public void setMachines(ArrayList<Machine> machines) {
        this.machines = machines;
    }

    public void flipChange(){
        this.onChange = !this.onChange;
    }
    public void setChange(boolean change){
        this.onChange = change;
    }
    public boolean getChange(){
        return this.onChange;
    }

    public Network(){
        this.bufferQueues = new HashMap<>();
        this.machines = new ArrayList<>();
        this.careTaker = new CareTaker();
        this.orginator = new Generator();

    }

    public ArrayList<Object> getNetwork() {
        ArrayList<Object> ret = new ArrayList<>();
        ArrayList<Machine> copiedMachines = new ArrayList<>();
        ArrayList<Queue> copiedBuffer = new ArrayList<>();
        ArrayList<Object> carry = new ArrayList<>();
        System.out.println("change state"+ this.getChange());
        if(this.getChange() == true){
            System.out.println("inside true");
            this.setChange(false);
            ret.add(this.machines);
            ret.add(this.bufferQueues.values());
            for(Machine machine:this.machines){
                copiedMachines.add(machine.copy());
            }
            for(Queue bufferQueue:this.bufferQueues.values()){
                copiedBuffer.add(bufferQueue.copy());//bufferQueue.copy());
            }
            carry.add(copiedMachines);
            carry.add(copiedBuffer);
            this.orginator.setNetwork(carry);
            this.careTaker.AddSnapshot(this.orginator.savingNetwork());
        }
        else{
            ret = null;
            this.orginator.setNetwork(ret);
            this.careTaker.AddSnapshot(this.orginator.savingNetwork());
        }

        return ret;
    }

    public ArrayList<ArrayList<Object>> replay(){
        ArrayList<ArrayList<Object>> networks = new ArrayList<>();
        for(int i=0; i < this.careTaker.GetSize();i++){
            this.orginator.GetFromMem(this.careTaker.LoadSnapshot(i));
            networks.add(this.orginator.getNetwork());
        }
        return networks;
    }


    public void addBufferQueue(String ID, Queue queue){
        this.bufferQueues.put(ID,queue);
    }

    void createStartingQueue(Queue bufferQueue) throws Exception {
        for (int i = 0; i < 100; i++) {
            bufferQueue.enqueue(new Product(), this);
        }
    }

    public void  initialize(HashMap<String, String[]> forwardProductionNetwork, HashMap<String, String[]> backwardProductionNetwork){

        //forward initilaization
        for(String element:forwardProductionNetwork.keySet()){
            Machine machine = new Machine(element);
            ArrayList<Queue> queues = new ArrayList<>();
            for (String valueElement:forwardProductionNetwork.get(element)){
                if(this.bufferQueues.containsKey(valueElement)){
                    queues.add(this.bufferQueues.get(valueElement));
                }else {
                    Queue queue =new Queue(valueElement);//new Queue(valueElement);
                    queues.add(queue);
                    this.addBufferQueue(valueElement,queue);
                }
            }
            machine.setNextQueues(queues); //setNextBufferQueues(queues);
            this.machines.add(machine);
        }
        //backward initilaization

        for (String element:backwardProductionNetwork.keySet()){
            if(!backwardProductionNetwork.containsKey(element)){
                Machine machine = new Machine(element);
                ArrayList<Queue> queues1 = new ArrayList<>();
                for (String valueElement:backwardProductionNetwork.get(element)){
                    if(this.bufferQueues.containsKey(valueElement)){
                        queues1.add(this.bufferQueues.get(valueElement));
                    }else {
                        Queue queue = new Queue(valueElement);
                        queues1.add(queue);
                        this.addBufferQueue(valueElement,queue);
                    }
                }
                machine.setPrevQueues(queues1); //setPrevBufferQueues;
                this.machines.add(machine);
            }else {
                for(Machine machine:this.machines){
                    if(machine.getName()/*getMachineName()*/ == element) {
                        ArrayList<Queue> queues2 = new ArrayList<>();
                        for (String valueElement : backwardProductionNetwork.get(element)) {
                            if(this.bufferQueues.containsKey(valueElement)){
                                queues2.add(this.bufferQueues.get(valueElement));
                            }else {
                                Queue queue = new Queue(valueElement);
                                queues2.add(queue);
                                this.addBufferQueue(valueElement, queue);
                            }
                        }
                        machine.setPrevQueues(queues2);//setPrevBufferQueues;
                        break;
                    }
                }
            }
        }
    }
    public void stop(){
        this.stop = true;
    }
    public void inputStop(){
        this.inputStop = true;
    }


    public void play(){

        this.stop = false;


        try {
            System.out.println("called play");

            InputThread inputThread = new InputThread();
            inputThread.addProduct(this.bufferQueues.get("Q999"), this);
            System.out.println("1");
            for(Machine machine:machines) {
                System.out.println("2");
                for (Queue nextQueue:machine.getNextQueues()){
                    System.out.println("3");
                    for (Queue prevQueue:machine.getPrevQueues()){
                        System.out.println("4");
                        machine.active(prevQueue,nextQueue,this);
                    }
                }
            }

        }
        catch (Exception e){
            e.printStackTrace();
        }
    }
}

