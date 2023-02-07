package com.example.producerconsumerBackend.Controller;

import java.util.ArrayList;

public class CareTaker {
    private ArrayList<SnapShot> store = new ArrayList<>();//this to store the different networks in the memory

    public CareTaker(){}//constructor

    public void AddSnapshot(SnapShot snapshot){//Save another memento
        store.add(snapshot);
    }

    public SnapShot LoadSnapshot(int index) {//load the desired memento
        return store.get(index);
    }
    public int GetSize(){//get # of memento objects
        return store.size();
    }

    public void ClearHistory(){//To clear every memento objects from memory
        store = new ArrayList<>();
    }
}