'use client';

import { Add, Delete } from "@mui/icons-material";
import { Box, Button, Divider, Grid, IconButton, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { NumberInput } from "../_components/inputs/NumberInput";
import { SwitchInput } from "../_components/inputs/SwitchInput";
import { TextInput } from "../_components/inputs/TextInput";
import { PageHeader } from "../_components/ui/PageHeader";
import { DropdownInput } from "../_components/inputs/DropdownInput";

interface Person { name: string; total: number; }
interface SharedItem { name: string; value: number; splitBy: string[]; }
interface CheckData {
    people: Person[];
    tipPercentage: number;
    taxAmount: number;
    sharedItems: SharedItem[];
    includeTaxInTip: boolean;
}

interface TotalInfo {
    name?: string;
    total: number;
    preTaxTotal: number;
    tax: number;
    subTotal: number;
    tip: number;
}

function formatCurrency(value: number): string {
    return `$${value.toFixed(2)}`;
}

const EVERYBODY = "everybody";

export default function SplitCheckPage() {
    const defaultPeople = [{ name: "", total: 0 }];
    const methods = useForm<CheckData>({ defaultValues: { tipPercentage: 20, taxAmount: 0, sharedItems: [], people: defaultPeople, includeTaxInTip: true } });
    const people = methods.watch("people");
    const sharedItems = methods.watch("sharedItems");
    const handlePersonChange = (index: number, field: "name" | "total", value: string | number) => {
        methods.setValue("people", people.map((f, i) => (i === index ? { ...f, [field]: value } : f)));
    };
    const addPerson = () => methods.setValue("people", [...people, { name: "", total: 0 }]);
    const removePerson = (index: number) => methods.setValue("people", people.filter((_, i) => i !== index));

    const handleSharedItemChange = (index: number, field: "name" | "value" | "splitBy", value: string | number | string[]) => {
        methods.setValue("sharedItems", sharedItems.map((f, i) => (i === index ? { ...f, [field]: value } : f)));
    };
    const addSharedItem = () => methods.setValue("sharedItems", [...sharedItems, { name: "", value: 0, splitBy: [EVERYBODY] }]);
    const removeSharedItem = (index: number) => methods.setValue("sharedItems", sharedItems.filter((_, i) => i !== index));

    const [individualTotals, setIndividualTotals] = useState<TotalInfo[]>([]);
    const [totalInfo, setTotalInfo] = useState(0);
    const mapSharedItemsToPeople = (data: CheckData) => {
        return data.sharedItems.reduce((map, sharedItem) => {
            let people = sharedItem.splitBy;
            if (sharedItem.splitBy.includes(EVERYBODY)) {
                people = data.people.map((person) => person.name);
            }

            const sharedItemValue = parseFloat(sharedItem.value.toString()) / people.length;
            people.forEach((person) => {
                if (!map[person]) {
                    map[person] = 0;
                }
                map[person] = map[person] + sharedItemValue;
            }
            );
            return map;
        }, {} as Record<string, number>);
    }
    const onSubmit = (data: CheckData) => {
        const sharedItemTotalByPerson = mapSharedItemsToPeople(data);
        const itemTotal = Object.keys(sharedItemTotalByPerson).reduce((sum, personName) => sum + parseFloat(sharedItemTotalByPerson[personName].toString()), 0)
            + data.people.reduce((sum, person) => sum + parseFloat(person.total.toString()), 0);
        const taxPercentage = data.taxAmount / itemTotal;
        const tipPercentage = data.tipPercentage / 100;

        const calculatedTotals = data.people.map((person: any) => {
            const preTaxTotal = parseFloat(person.total.toString()) + (sharedItemTotalByPerson[person.name] || 0);
            const tax = preTaxTotal * taxPercentage;
            const subTotal = preTaxTotal + tax;
            const tip = (data.includeTaxInTip ? subTotal : preTaxTotal) * tipPercentage;
            const adjustedTotal = subTotal + tip;
            return { name: person.name, total: adjustedTotal, preTaxTotal, tax, subTotal, tip };
        });
        setIndividualTotals(calculatedTotals);
        setTotalInfo(calculatedTotals.reduce((sum, person) => sum + person.total, 0));
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
                            <Grid size={4}>
                                <TextInput
                                    label="Name"
                                    fieldName={`sharedItems[${idx}].name`}
                                    onChange={(e) => handleSharedItemChange(idx, "name", e.target.value)}
                                    requiredMessage="Shared item name is required"
                                />
                            </Grid>
                            <Grid size={3}>
                                <NumberInput
                                    label="Value"
                                    fieldName={`sharedItems[${idx}].value`}
                                    onChange={(e) => handleSharedItemChange(idx, "value", e.target.value)}
                                    requiredMessage="Value is required"
                                />
                            </Grid>
                            <Grid size={4}>
                                <DropdownInput
                                    label="Split By"
                                    fieldName={`sharedItems[${idx}].splitBy`}
                                    options={[
                                        { value: EVERYBODY, label: "Everybody" },
                                        ...(people.map((p, i) => ({ value: p.name || `Person ${i + 1}`, label: p.name || `Person ${i + 1}` })))
                                    ]}
                                    onChange={(e) => handleSharedItemChange(idx, "splitBy", e.target.value)}
                                    requiredMessage="Split By is required"
                                    isMultiSelect={true}
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
        {individualTotals.length > 0 && (<Box margin={2}>
            <Typography variant="h5">Total: {formatCurrency(totalInfo)}</Typography>
            <Divider />
            <Grid container spacing={1} marginTop={1}>
                {individualTotals.map((person) => (
                    <Grid size={3} key={person.name}>
                        <Paper elevation={3} className="p-2">
                            <Typography variant="h6">
                                {person.name}: {formatCurrency(person.total)}
                            </Typography>
                            <Typography variant="body1">
                                Pre-tax Total: {formatCurrency(person.preTaxTotal)}
                            </Typography>
                            <Typography variant="body1">
                                Tax: {formatCurrency(person.tax)}
                            </Typography>
                            <Typography variant="body1">
                                Sub Total: {formatCurrency(person.subTotal)}
                            </Typography>
                            <Typography variant="body1">
                                Tip: {formatCurrency(person.tip)}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>)}
    </>
}