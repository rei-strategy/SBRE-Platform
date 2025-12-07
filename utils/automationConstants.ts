export const RESOURCE_FIELDS = {
    client: [
        { label: 'City', value: 'city', type: 'text', example: 'New York' },
        { label: 'State', value: 'state', type: 'text', example: 'NY' },
        { label: 'Zip Code', value: 'zip', type: 'text', example: '90210' },
        { label: 'Tags', value: 'tags', type: 'text', example: 'VIP' },
        { label: 'First Name', value: 'first_name', type: 'text', example: 'John' },
        { label: 'Last Name', value: 'last_name', type: 'text', example: 'Doe' },
        { label: 'Email', value: 'email', type: 'text', example: 'john@example.com' },
        { label: 'Total Spent', value: 'total_spent', type: 'number', example: '1000' }
    ],
    job: [
        { label: 'Status', value: 'status', type: 'select', options: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], example: 'COMPLETED' },
        { label: 'Type', value: 'type', type: 'text', example: 'Installation' },
        { label: 'Price', value: 'price', type: 'number', example: '150' },
        { label: 'City', value: 'city', type: 'text', example: 'New York' },
        { label: 'State', value: 'state', type: 'text', example: 'NY' }
    ],
    quote: [
        { label: 'Status', value: 'status', type: 'select', options: ['SENT', 'APPROVED', 'DECLINED'], example: 'APPROVED' },
        { label: 'Total Value', value: 'total', type: 'number', example: '1000' }
    ],
    invoice: [
        { label: 'Status', value: 'status', type: 'select', options: ['SENT', 'PAID', 'OVERDUE'], example: 'PAID' },
        { label: 'Balance Due', value: 'balanceDue', type: 'number', example: '0' },
        { label: 'Total Amount', value: 'total', type: 'number', example: '500' }
    ]
};
