schema_definitions = [
    {
        "schema database": "cybersecurity",
        "tables": [
            {
                "schema table name": "incidents",
                "schema table columns": [
                    "id: Unique identifier of the incident",
                    "title: Short title of the incident",
                    "description: Detailed description of the incident",
                    "status: Current status of the incident (e.g. Open, In Progress, Resolved, Closed)",
                    "priority: Importance level of the incident (e.g., Low, Medium, High, Critical)",
                    "severity: Impact level of the incident (e.g. Low, Medium, High, Critical)",
                    "category: Classification of the incident (e.g. Network, Hardware, Application, Security, Database)",
                    "source: Origin of the incident (e.g. Monitoring, User, Email, SIEM, API)",
                    "created_at: Date and time when the incident was created",
                    "updated_at: Date and time when the incident was last updated",
                    "resolved_at: Date and time when the incident was resolved",
                    "reported_by: Person who reported the incident",
                    "assigned_to: Person assigned to handle the incident",
                    "notified: Indicates whether relevant stakeholders were notified (true/false)",
                    "acknowledged: Indicates whether the incident has been acknowledged (true/false)",
                    "sla_due: SLA deadline for resolving the incident"
                ]
            },
            {
                "schema table name": "alarms",
                "schema table columns": [
                    "id: Unique identifier of the alarm",
                    "name: Name of the alarm",
                    "source_type: Source type (e.g., UFM, UPM)",
                    "description: Detailed description of the alarm",
                    "count: Number of occurrences of the alarm",
                    "severity: Severity level of the alarm (e.g., Low, Medium, High, Critical)",
                    "dtetime: Date and time the alarm was generated",
                ]
            },
            {
                "schema table name": "thread_advisories",
                "schema table columns": [
                    "id: Unique identifier of the advisory",
                    "advisory_name: Name/title of the threat advisory",
                    "threat_type: Type/category of the threat (e.g., Trojan, Phishing, Ransomware)",
                    "description: Detailed description of the advisory",
                    "severity: Severity level of the threat (Low, Medium, High, Critical)",
                    "affected_ips: Comma-separated list of affected IP addresses",
                    "detection_date: Date and time the threat was detected",
                    "resolved_date: Date and time the threat was resolved (nullable)",
                    "status: Current status of the advisory (Open, In Progress, Resolved)",
                    "recommendation: Suggested actions to remediate the threat",
                    "count: Number of times the threat has been observed",
                ]
            }
        ]
    },
    {
        "schema database": "health_care",
        "tables": [
            {
                "schema table name": "claim",
                "schema table columns": [
                    "claim_id: Unique identifier for the claim",
                    "policy_number: Insurance policy number associated with the claim",
                    "claimant_name: Name of the person who filed the claim",
                    "claim_date: Date when the claim was submitted",
                    "claim_amount: Total amount claimed",
                    "claim_type: Type of claim (e.g., Health, Auto, Home, Travel)",
                    "claim_status: Current status of the claim (e.g., Pending, Approved, Rejected)",
                    "incident_description: Description of the incident leading to the claim",
                    "approved_amount: Amount approved after claim processing",
                    "adjuster_name: Name of the person who reviewed and processed the claim"
                ]
            }
        ]
    },
    {
        "schema database": "stock",
        "tables": [
            {
                "schema table name": "products",
                "schema table columns": [
                    "item_name: Name or category of the clothing item (e.g., Lehga, Kurti, Saree)",
                    "design_number: Unique identifier or design reference for the item",
                    "brand: Brand or manufacturer name",
                    "size: Size of the clothing item (e.g., S, M, L, XL, Free)",
                    "color: Primary color of the item",
                    "barcode: Unique barcode for tracking or scanning the product",
                    "stock: Number of items currently available in inventory",
                    "price: Selling price of a single item in INR (₹)",
                    "image_url: Web URL or file path of the product image"
                ]
            }
        ]
    }

]
