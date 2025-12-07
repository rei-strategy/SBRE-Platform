import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays, startOfWeek, endOfWeek, parseISO } from 'date-fns';
import { useAppStore } from '../../../../store';
import { JobStatus, InvoiceStatus, Client } from '../../../../types';

export const useAgenticAI = () => {
    const navigate = useNavigate();
    const store = useAppStore();
    const [isAiTyping, setIsAiTyping] = useState(false);

    const AI_CHAT_ID = 'ai-assistant-chat';

    const runAgenticWorkflow = useCallback(async (input: string) => {
        setIsAiTyping(true);

        // Simulate AI processing thought
        await new Promise(resolve => setTimeout(resolve, 1200));

        const lowerInput = input.toLowerCase();
        let handled = false;

        // Helper to send response
        const reply = (lines: string[]) => {
            store.sendMessage(AI_CHAT_ID, lines.join('\n'), 'ai-bot');
            handled = true;
        };

        try {
            // 1. REVENUE PROJECTION
            if (lowerInput.includes('revenue') || lowerInput.includes('money') || lowerInput.includes('sales')) {
                const start = startOfWeek(new Date());
                const end = endOfWeek(new Date());

                // Calculate actual revenue from paid invoices
                const actualRevenue = store.invoices
                    .filter(inv => inv.status === InvoiceStatus.PAID)
                    .reduce((sum, inv) => sum + inv.total, 0);

                // Calculate projected from scheduled jobs (sum of items total)
                const scheduledJobsValue = store.jobs
                    .filter(j => j.status === JobStatus.SCHEDULED)
                    .reduce((sum, j) => sum + j.items.reduce((s, i) => s + i.total, 0), 0);

                const pendingInvoices = store.invoices
                    .filter(inv => inv.status === InvoiceStatus.SENT)
                    .reduce((sum, inv) => sum + inv.total, 0);

                reply([
                    `### 💰 Financial Snapshot`,
                    `Here is the breakdown for this week:`,
                    `- **Collected Revenue**: $${actualRevenue.toLocaleString()}`,
                    `- **Pending Invoices**: $${pendingInvoices.toLocaleString()}`,
                    `- **Projected (Scheduled Jobs)**: $${scheduledJobsValue.toLocaleString()}`,
                    ``,
                    `**Total Projected**: $${(actualRevenue + pendingInvoices + scheduledJobsValue).toLocaleString()}`
                ]);
            }

            // 2. SCHEDULE CHECK
            else if (lowerInput.includes('schedule') || lowerInput.includes('busy') || lowerInput.includes('free')) {
                const tomorrow = addDays(new Date(), 1);
                const tomorrowStr = format(tomorrow, 'yyyy-MM-dd');

                // Assuming job.start is ISO string, we compare date parts or use isSameDay
                const jobsTomorrow = store.jobs.filter(j => j.start.startsWith(tomorrowStr.split('T')[0]) || format(parseISO(j.start), 'yyyy-MM-dd') === tomorrowStr);

                if (jobsTomorrow.length === 0) {
                    reply([
                        `### 📅 Schedule Update`,
                        `You have **0 jobs** scheduled for tomorrow (${format(tomorrow, 'EEEE, MMM do')}).`,
                        `It's a good day to push some marketing emails!`
                    ]);
                } else {
                    reply([
                        `### 📅 Schedule Update`,
                        `You have **${jobsTomorrow.length} jobs** scheduled for tomorrow:`,
                        ...jobsTomorrow.map(j => {
                            const client = store.clients.find(c => c.id === j.clientId);
                            const clientName = client ? `${client.firstName} ${client.lastName}` : 'Unknown';
                            return `- **${format(parseISO(j.start), 'h:mm a')}**: ${j.title} for ${clientName}`;
                        })
                    ]);
                }
            }

            // 3. JOB CREATION (QL)
            else if (lowerInput.includes('create job') || lowerInput.includes('new job') || lowerInput.includes('book')) {
                reply([
                    `### 🛠️ Drafting Job`,
                    `I've started a draft for a new job.`,
                    `Please confirm details in the job creation form.`
                ]);
            }

            // 4. INVENTORY CHECK
            else if (lowerInput.includes('stock') || lowerInput.includes('inventory') || lowerInput.includes('supplies')) {
                // Check inventory products where quantity (from records sum) is < minStock
                const lowStock = store.inventoryProducts.filter(p => {
                    const currentStock = store.inventoryRecords
                        .filter(r => r.productId === p.id)
                        .reduce((sum, r) => sum + r.quantity, 0);
                    return currentStock < p.minStock;
                });

                if (lowStock.length > 0) {
                    reply([
                        `### ⚠️ Low Stock Alert`,
                        `The following items are running low:`,
                        ...lowStock.map(p => {
                            const qty = store.inventoryRecords.filter(r => r.productId === p.id).reduce((s, r) => s + r.quantity, 0);
                            return `- **${p.name}**: ${qty} ${p.unit} (Min: ${p.minStock})`;
                        }),
                        ``,
                        `[Order Supplies](action:order_supplies)`
                    ]);
                } else {
                    reply([
                        `### ✅ Inventory Healthy`,
                        `All stock levels are above minimum thresholds.`
                    ]);
                }
            }

            // DEFAULT / FALLBACK
            else {
                reply([
                    `I can help you with:`,
                    `- **Revenue Projections** ("How much money made this week?")`,
                    `- **Schedule Checks** ("Is tomorrow busy?")`,
                    `- **Inventory Status** ("Check stock levels")`,
                    `- **Drafting Jobs** ("Create a new job")`
                ]);
            }

        } catch (error) {
            console.error("AI Error:", error);
            reply([
                `### ❌ System Error`,
                `I encountered an error processing your request.`
            ]);
        } finally {
            setIsAiTyping(false);
        }

    }, [navigate, store]);

    return {
        isAiTyping,
        runAgenticWorkflow
    };
};
