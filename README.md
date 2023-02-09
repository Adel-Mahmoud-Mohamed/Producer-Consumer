# Producer-Consumer-
 Producer/Consumer Simulation Program developed using Angular Framework and Spring Boot
 
 ## Contents:
- [Contributers](#Contributers)
- [Frameworks and technology used](#Frameworks-and-technology-used)
- [How to run](#How-to-run)
- [Used design patterns](#used-design-patterns)
- [UML class diagram](#UML-class-diagram)
- [How the system works](#How-the-system-works)
- [Snapshots of our UI and a user guide](#Snapshots-of-our-UI-and-a-user-guide)
- [Demo Video for using the app](#Demo-Video-for-using-the-app)
---
## Contributers:
* [Adel Mahmoud](https://github.com/Adel-Mahmoud-Mohamed)
* [Mohamed Hassan](https://github.com/mohamedhassan279)
* [Mahmoud Attia](https://github.com/mahmoudattia12)
* [Mahmoud Ghlab](https://github.com/Mahmoudjobdis)
---
## Frameworks and technology used:
- For the frontend part (view part), we used HTML, CSS, and typescript through angular framework.
- For the backend (model and controller), we used Java language through spring framework.
---
## How to run:
- Note: Make sure you have downloaded NodeJs and Angular-CLI.
- Extract the compressed project folder.
#### Back-end part:
- Open the Producer-Consumer-Backend folder using IntelliJ IDE, and run the ProducerConsumerBackendApplication.java class on port 9080. you can change the port from the project resources at application.properties (server.port = …..) if the 9080 port was already used in your device but in this case, you will need to change it in all http requests in the angular folder.
#### Front-end part:
- open the “producer-consumer-frontend” folder using visual studio IDE, then open the terminal of the IDE, and write:
- npm install in the terminal.
- ng serve --open in the terminal to open the project, on port “http://localhost:4200/”. Note: if you needed to change port 4200 as it was already in use then you will need to change it in the Producer-Consumer-Backend folder in the controller class
---
## Used design patterns:
### 1- Observer Design Pattern:
The intent of this design pattern is to define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically. In our code, we implement it by creating the Interface called “IObserver”. Then, two classes called Machine Observer and Queue Observer are the concrete classes that implement the “IObserver” interface. There is a class called “Manager” which observes the changes on the machine and queues, then by calling the function “notify” the queues are notified and updated automatically. The goal of this is that we want to notify and update the state of the machines in the network once the state of any queue has changed and vice versa, and here’s the UML for that DP.

![image](https://user-images.githubusercontent.com/96317608/217539991-ce5bd88b-2daa-472f-8db3-6eaaff3a6099.png)

### 2- Producer Consumer Design Pattern:
The intent is to organize the communication between the producer and consumer objects (the queues and machines here in our context) and control the multithreaded flow in the network. Briefly, we used it by creating two classes which are “Queue” and “Machine”. The Network contains a list of machines and queues in a certain order. There may be a multi-level of machines and queues the process started by queuing the products to be produced in “Q0”, then each machine takes a single product only and the rest wait in the queue until any of the machines finished, then the first product in the queue will enter the first available machine and, the second entered the next machine and so on in all levels until all products gathered in the “Qn”(i.e. Last level of the network) and here’s the UML for that DP.

![image](https://user-images.githubusercontent.com/96317608/217540154-ad247ac5-9945-4b89-b429-b03ed73cea50.png)

### 3- SnapShot:
We use this design pattern in order to restore(keep a memento or in other words take a snapshot) of the network each time a change of the state occurs to help us replay the simulation from the beginning until the exact moment we’ve stopped at. The class “Generator”, “CareTaker” and “SnapShot” are the main elements to apply this design pattern. “Generator” communicates with “SnapShot” either to store the current states of the network or get the previous states of the current network. “CareTaker” is our storage for the networks it keeps a list of mementos and supports the different operations on this list like adding a memento to the list getting all mementos etc.

![image](https://user-images.githubusercontent.com/96317608/217540260-9c8fb625-f4ae-45b5-beb2-a2e1c9dd23cb.png)

### 4- Singleton:
we used it in order to create a single instance from “Manager” Class to reuse it after creation-because it’s kind of a huge class so it costs a lot creating a new instance every now and then-to be able to manage the resources such as “AddingObserver”, ”RemovingObserver” and also notify the whole network if there is any change in the states.

---
## How the system works
- The number of products is random and initially the default queue gets a random input rate of the products and through this queue, the products are distributed over the first level of machine(s).
- Each machine in the network has a random service time that remains the same till the process ends.
- Each machine serves one product at a time and the speed of service is according to the machine’s service time.
- And from the first level machine(s) the products are transferred along the network up to the second level and so on until the products are completely serviced and then they’re stored in the final buffer.
- The Observer DP is used to for notifying the network elements each state change and according to that other states are updated.
- The memento DP is used to keep a memento of the network each state change for the replay feature.
- The concurrency DP is used to control the multi-threaded flow along the network.
---

## UML class diagram:
- [link to the uml class diagram](https://drive.google.com/file/d/1CxZbJAS9B4kF3JgUjZnGSZPclNfNDkTh/view?usp=share_link)
---
## Snapshots of our UI and a user guide:

![image](https://user-images.githubusercontent.com/96317608/217541122-47d3d69e-3e7d-4160-8e51-c7c971395142.png)

The queue Q0 is added by default initially.
- Machine button: to add a new machine.
- +Queue button: to add a new queue.
- Connect items: to connect a queue to a machine in any direction. To connect between a queue and a machine first press the button and click on the start shape and hold, dragging the arrow to the destination shape.
- Run button: to start the simulation.
- Each M has a random service time and can serve one product at a time.
- Each M changes its color to the color of the product being processed.
- Each Q displays the number of products waiting.
- Stop button: to stop the simulation.
- Replay button: to replay the simulation.
- Stop input button: to stop products arriving at Q0.
- Clear all button: to clear all the network in order to add a new network.
- In case a machine is not connected to at least one queue at both directions this error message appears.

![image](https://user-images.githubusercontent.com/96317608/217541320-55c70415-418f-49c7-8fca-90e28f26655e.png)
![image](https://user-images.githubusercontent.com/96317608/217541348-255e2a13-1faf-4c7a-b017-aeeb188d33c7.png)
![image](https://user-images.githubusercontent.com/96317608/217541365-03687858-c3b3-4701-a17f-20c47269a901.png)
![image](https://user-images.githubusercontent.com/96317608/217541391-919335ac-45bd-4ffb-9f92-a219d9aae478.png)

---
## Demo Video for using the app:
https://user-images.githubusercontent.com/96317608/217939091-4592c81a-134f-463e-a795-dfd6660f7c72.mp4
