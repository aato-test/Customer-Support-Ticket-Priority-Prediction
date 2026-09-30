### **Problem Statement**

Customer support teams struggle with high volumes of incoming tickets due to manual prioritization and assignment. This manual triage causes delayed resolutions for critical issues, inconsistent prioritization across agents, and an uneven distribution of workload.

### **Expected Outcomes**

* **Centralized Database:** A dedicated custom object (`Support Ticket Intelligence`) to store and track all support service requests.
* **AI-Driven Classification:** Integration with Agentforce to automatically analyze ticket descriptions and classify them into **High**, **Medium**, or **Low** priority levels.
* **Automated Routing & Tasks:** Automated workflows that instantly assign tickets and generate urgent follow-up tasks for critical high-priority incidents.
* **Manager Visibility:** Role-based access controls and analytics reporting to monitor team capacity, track ticket status, and ensure SLAs are met.

### **Core Architecture**

* **Custom Object:** `Support_Ticket_Intelligence__c` featuring fields for `Issue_Description__c`, `Priority_Level__c`, `Ticket_Status__c`, and `Assigned_Agent__c`.
* **Automation:** An Auto-Launched Flow (`Support Ticket Automated Assignment`) to evaluate the AI prediction, update priority fields, route assignments, and spawn urgent tasks.
* **Intelligence Layer:** An Agentforce subagent configured to evaluate incoming text and return an urgency rating.
