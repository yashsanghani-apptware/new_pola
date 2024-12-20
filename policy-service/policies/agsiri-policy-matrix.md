Policy Matrix for Agsiri Services and Roles
This matrix maps the possible permissions for each service and resource based on the roles. The Y-axis lists the services and resources, and the X-axis lists the roles.

Roles
Administrator: Full access to manage users, roles, policies, and all resources.
Compliance Manager: Oversees regulatory compliance and access control.
Seller: Manages property listings.
Buyer: Views and assesses property listings.
Farm SME: Conducts farm assessments and due diligence.
Farm Manager: Manages daily farm operations.
Investor: Subscribes to offerings and manages portfolios.
Campaign Manager: Designs and launches marketing campaigns.
Executive: Reviews financial data and dashboards.
Services and Resources
IAM and Policy Service
Users
Roles
Policies
Agsiri Marketplace Service
Farms
Listings
Offerings
Campaigns
Subscriptions
Farming Service
ESG Assessments
Reports
Notification and Actions Service
Notifications
Actions
Events
Trading Service
Trades
Workflow Service
Workflows
Tasks
Functions
Incident and Case Management Service
Incidents
Cases
Data Room Service
Data Rooms
Cabinets
Files
Mailboxes
Personalized Notifications
Policy Matrix
Service / Resource	Administrator	Compliance Manager	Seller	Buyer	Farm SME	Farm Manager	Investor	Campaign Manager	Executive
IAM and Policy Service									
Users	Full	View, Monitor	-	-	-	-	-	-	-
Roles	Full	View, Monitor	-	-	-	-	-	-	-
Policies	Full	View, Monitor	-	-	-	-	-	-	-
Agsiri Marketplace Service									
Farms	Full	View, Monitor	Create, Update, View	View	Assess	Manage	View	-	View
Listings	Full	View, Monitor	Create, Update, View	View	-	-	-	-	-
Offerings	Full	View, Monitor	-	View	-	-	Subscribe	-	-
Campaigns	Full	View, Monitor	-	-	-	-	-	Create, View, Update	-
Subscriptions	Full	View, Monitor	-	-	-	-	Manage	-	-
Farming Service									
ESG Assessments	Full	View, Monitor	-	View	Assess	Manage	View	-	View
Reports	Full	View, Monitor	-	View	Assess	Manage	View	-	View
Notification and Actions Service									
Notifications	Full	View, Monitor	-	View	-	-	View	-	View
Actions	Full	View, Monitor	-	View	-	-	View	-	View
Events	Full	View, Monitor	-	View	-	-	View	-	View
Trading Service									
Trades	Full	View, Monitor	-	-	-	-	Execute	-	View
Workflow Service									
Workflows	Full	View, Monitor	-	-	-	-	-	-	-
Tasks	Full	View, Monitor	-	-	-	-	-	-	-
Functions	Full	View, Monitor	-	-	-	-	-	-	-
Incident and Case Management Service									
Incidents	Full	View, Monitor, Manage	-	-	-	-	-	-	-
Cases	Full	View, Monitor, Manage	-	-	-	-	-	-	-
Data Room Service									
Data Rooms	Full	View, Monitor	-	View	-	Manage	View	-	View
Cabinets	Full	View, Monitor	-	View	-	Manage	View	-	View
Files	Full	View, Monitor	-	View	-	Manage	View	-	View
Mailboxes	Full	View, Monitor	-	View	-	Manage	View	-	View
Personalized Notifications	Full	View, Monitor	-	View	-	Manage	View	-	View
Key
Full: All possible actions including create, view, update, delete, and manage policies.
View, Monitor: Limited to viewing and monitoring actions.
Create, Update, View: Ability to create, update, and view the resource.
Manage: Includes managing subscriptions, portfolios, and trades.
Assess: Specific to farm SME roles for assessments and due diligence.
Execute: Specific to investors for executing trades.
-: No access.
Example ARIs for All Services and Resources
Using the above matrix, here is a list of example ARIs for all services and associated resources.

IAM and Policy Service
Users: ari:agsiri:iam:us:123456789012:user/JohnDoe
Roles: ari:agsiri:iam:us:123456789012:role/AdminRole
Policies: ari:agsiri:iam:us:123456789012:policy/Policy123
Agsiri Marketplace Service
Farms: ari:agsiri:marketplace:us:123456789012:farm/Farm123
Listings: ari:agsiri:marketplace:us:123456789012:listing/FarmListing123
Offerings: ari:agsiri:marketplace:us:123456789012:offering/Offering123
Campaigns: ari:agsiri:marketplace:us:123456789012:campaign/Campaign123
Subscriptions: ari:agsiri:marketplace:us:123456789012:subscription/Subscription123
Farming Service
ESG Assessments: ari:agsiri:farming:us:123456789012:assessment/Assessment123
Reports: ari:agsiri:farming:us:123456789012:report/Report123
Notification and Actions Service
Notifications: ari:agsiri:notifications:us:123456789012:notification/Notification123
Actions: ari:agsiri:notifications:us:123456789012:action/Action123
Events: ari:agsiri:notifications:us:123456789012:event/Event123
Trading Service
Trades: ari:agsiri:trading:us:123456789012:trade/Trade123
Workflow Service
Workflows: ari:agsiri:workflow:us:123456789012:workflow/Workflow123
Tasks: ari:agsiri:workflow:us:123456789012:task/Task123
Functions: ari:agsiri:workflow:us:123456789012:function/Function123
Incident and Case Management Service
Incidents: ari:agsiri:incidents:us:123456789012:incident/Incident123
Cases: ari:agsiri:incidents:us:123456789012:case/Case123
Data Room Service
Data Rooms: ari:agsiri:dataroom:us:123456789012:dataroom/DataRoom123
Data Rooms: ari:agsiri:dataroom:us:123456789012:dataroom/* (All datarooms)
Data Rooms: ari:agsiri:dataroom:us:123456789012:dataroom/farm* (All datarooms whose names are starting with farm.)
Cabinets: ari:agsiri:dataroom:us:123456789012:cabinet/Cabinet123
Files: ari:agsiri:dataroom:us:123456789012:file/File123
Mailboxes: ari:agsiri:dataroom:us:123456789012:mailbox/Mailbox123
Personalized Notifications: ari:agsiri:dataroom:us:123456789012:notification/Notification123
