'use client';

import { Add, Delete } from "@mui/icons-material";
import { Box, Button, Divider, Grid, IconButton, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { NumberInput } from "../_components/inputs/NumberInput";
import { SwitchInput } from "../_components/inputs/SwitchInput";
import { TextInput } from "../_components/inputs/TextInput";
import { PageHeader } from "../_components/ui/PageHeader";

interface Person { name: string; total: number; }
interface SharedItem { name: string; value: number; }
interface CheckData {
    people: Person[];
    tipPercentage: number;
    taxAmount: number;
    sharedItems: SharedItem[];
    includeTaxInTip: boolean;
}

function formatCurrency(value: number): string {
    return `$${value.toFixed(2)}`;
}

export default function SplitCheckPage() {
    const defaultPeople = [{ name: "", total: 0 }];
    const methods = useForm<CheckData>({ defaultValues: { tipPercentage: 20, taxAmount: 0, sharedItems: [], people: defaultPeople, includeTaxInTip: true } });
    const [people, setPeople] = useState<Person[]>(defaultPeople);
    const handlePersonChange = (index: number, field: "name" | "total", value: string | number) => {
        setPeople((prev) =>
            prev.map((f, i) => (i === index ? { ...f, [field]: value } : f))
        );
    };
    const addPerson = () => setPeople((prev) => [...prev, { name: "", total: 0 }]);
    const removePerson = (index: number) => setPeople((prev) => prev.filter((_, i) => i !== index));

    const [sharedItems, setSharedItems] = useState<any[]>([]);
    const handleSharedItemChange = (index: number, field: "name" | "value", value: string | number) => {
        setSharedItems((prev) =>
            prev.map((f, i) => (i === index ? { ...f, [field]: value } : f))
        );
    };
    const addSharedItem = () => setSharedItems((prev) => [...prev, { name: "", total: 0 }]);
    const removeSharedItem = (index: number) => setSharedItems((prev) => prev.filter((_, i) => i !== index));

    const [totals, setTotals] = useState<Person[]>([]);
    const [total, setTotal] = useState(0);
    const onSubmit = (data: CheckData) => {
        const sharedTotal = data.sharedItems.reduce((sum, item) => sum + parseFloat(item.value.toString()), 0);
        const totalSum = sharedTotal + data.people.reduce((sum, person) => sum + parseFloat(person.total.toString()), 0);
        const taxPercentage = data.taxAmount / totalSum;
        const tipPercentage = data.tipPercentage / 100;
        const percentageMultiplier = (1 + tipPercentage + taxPercentage);
        const sharedSplit = sharedTotal / data.people.length;

        const calculatedTotals = data.people.map((person: any) => {
            const total = parseFloat(person.total.toString());
            const adjustedTotal = data.includeTaxInTip
                ? ((total + sharedSplit) * (1 + taxPercentage)) * (1 + tipPercentage)
                : (total + sharedSplit) * percentageMultiplier;
            return { name: person.name, total: adjustedTotal };
        });
        setTotals(calculatedTotals);
        setTotal(calculatedTotals.reduce((sum, person) => sum + person.total, 0));
    }
    return <>
        <PageHeader title="Check Splitter" />
        <FormProvider {...methods}>
            <Grid container spacing={2} rowGap={2} className="m-2 p-2">
                <Grid size={12}>
                    <Typography variant="h6" gutterBottom>People</Typography>
                    {people.map((_, idx) => (
                        <Grid container spacing={1} key={idx} alignItems="center" marginBottom={2}>
                            <Grid size={6}>
                                <TextInput
                                    label="Name"
                                    fieldName={`people[${idx}].name`}
                                    onChange={(e) => handlePersonChange(idx, "name", e.target.value)}
                                    requiredMessage="Feature name is required"
                                />
                            </Grid>
                            <Grid size={5}>
                                <NumberInput
                                    label="Total"
                                    fieldName={`people[${idx}].total`}
                                    onChange={(e) => handlePersonChange(idx, "total", e.target.value)}
                                    requiredMessage="Total is required"
                                />
                            </Grid>
                            <Grid size={1}>
                                <IconButton color="error" title="Remove" onClick={() => removePerson(idx)}><Delete /></IconButton>
                            </Grid>
                        </Grid>
                    ))}
                    <Button variant="outlined" onClick={addPerson} startIcon={<Add />}>Add Person</Button>
                </Grid>
                <Grid size={12}>
                    <Typography variant="h6" gutterBottom>Shared Items</Typography>
                    {sharedItems.map((_, idx) => (
                        <Grid container spacing={1} key={idx} alignItems="center" marginBottom={2}>
                            <Grid size={6}>
                                <TextInput
                                    label="Name"
                                    fieldName={`sharedItems[${idx}].name`}
                                    onChange={(e) => handleSharedItemChange(idx, "name", e.target.value)}
                                    requiredMessage="Shared item name is required"
                                />
                            </Grid>
                            <Grid size={5}>
                                <NumberInput
                                    label="Value"
                                    fieldName={`sharedItems[${idx}].value`}
                                    onChange={(e) => handleSharedItemChange(idx, "value", e.target.value)}
                                    requiredMessage="Value is required"
                                />
                            </Grid>
                            <Grid size={1}>
                                <IconButton color="error" title="Remove" onClick={() => removeSharedItem(idx)}><Delete /></IconButton>
                            </Grid>
                        </Grid>
                    ))}
                    <Button variant="outlined" onClick={addSharedItem} startIcon={<Add />}>Add Shared Item</Button>
                </Grid>
                <Grid size={12}>
                    <Typography variant="h6" gutterBottom>Add-Ons</Typography>
                </Grid>
                <Grid size={6}>
                    <NumberInput label="Tax Amount" fieldName="taxAmount" />
                </Grid>
                <Grid size={6}>
                    <NumberInput label="Tip Percentage" fieldName="tipPercentage" />
                </Grid>
                <Grid size={6}>
                    <SwitchInput label="Include Tax in Tip" fieldName="includeTaxInTip" />
                </Grid>
            </Grid>
            <Button role="submit" onClick={methods.handleSubmit(onSubmit)} variant="contained" color="primary" sx={{ margin: 2 }}>
                Calculate Totals
            </Button>
        </FormProvider>
        {totals.length > 0 && (<Box margin={2}>
            <Typography variant="h5">Total: {formatCurrency(total)}</Typography>
            <Divider />
            <Grid container spacing={1} marginTop={1}>
                {totals.map((person) => (
                    <Grid size={3} key={person.name}>
                        <Paper elevation={3} className="p-2">
                            <Typography variant="h6">
                                {person.name}: {formatCurrency(person.total)}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>)}
    </>
}