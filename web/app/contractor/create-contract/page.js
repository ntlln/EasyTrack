"use client";

import { useState } from "react";
import { Box, Typography, TextField, Button, Paper, useTheme, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Page() {
    const theme = useTheme();
    const supabase = createClientComponentClient();
    const [itemCount, setItemCount] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [contracts, setContracts] = useState([]);
    const [address, setAddress] = useState({
        addressLine1: "",
        addressLine2: "",
        province: "",
        city: "",
        barangay: "",
        postalCode: ""
    });

    const handleCountSubmit = () => {
        const count = parseInt(inputValue);
        if (!isNaN(count) && count > 0) {
            setItemCount(count);
            setContracts(Array.from({ length: count }, () => ({ 
                luggage_owner: "", 
                contact_number: "", 
                case_number: "",
                item_description: "",
                other_details: "",
                weight: "",
                image: null 
            })));
        }
    };

    const handleInputChange = (index, field, value) => {
        const updatedContracts = [...contracts];
        updatedContracts[index][field] = value;
        setContracts(updatedContracts);
    };

    const handleImageChange = (index, file) => {
        const updatedContracts = [...contracts];
        updatedContracts[index].image = file;
        setContracts(updatedContracts);
    };

    const clearSingleContract = (index) => {
        const updatedContracts = [...contracts];
        updatedContracts[index] = { 
            luggage_owner: "", 
            contact_number: "", 
            case_number: "",
            item_description: "",
            other_details: "",
            weight: "",
            image: null 
        };
        setContracts(updatedContracts);
    };

    const deleteContract = (index) => {
        const updatedContracts = contracts.filter((_, i) => i !== index);
        setContracts(updatedContracts);
        setItemCount(updatedContracts.length);
    };

    const addContract = () => {
        setContracts([...contracts, { 
            luggage_owner: "", 
            contact_number: "", 
            case_number: "",
            item_description: "",
            other_details: "",
            weight: "",
            image: null 
        }]);
        setItemCount(contracts.length + 1);
    };

    const handleAddressChange = (field, value) => {
        setAddress(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            // Insert luggage information directly
            const luggageData = contracts.map((contract, index) => {
                const luggageItem = {
                    id: index + 1,
                    luggage_owner: contract.luggage_owner || null,
                    contact_number: contract.contact_number || null,
                    case_number: contract.case_number || null,
                    item_description: contract.item_description || null,
                    other_details: contract.other_details || null
                };

                // Only add weight if it's a valid number
                if (contract.weight && !isNaN(parseFloat(contract.weight))) {
                    luggageItem.weight = parseFloat(contract.weight);
                }

                return luggageItem;
            });

            console.log('Submitting luggage data:', luggageData);

            const { data: luggageResult, error: luggageError } = await supabase
                .from('contract_luggage_information')
                .insert(luggageData)
                .select();

            if (luggageError) {
                console.error('Luggage insertion error:', luggageError);
                throw new Error(`Failed to insert luggage information: ${luggageError.message}`);
            }

            console.log('Luggage data inserted successfully:', luggageResult);

            // Handle successful submission
            alert('Contract submitted successfully!');
            // Reset form
            setItemCount(null);
            setInputValue("");
            setContracts([]);
            setAddress({
                addressLine1: "",
                addressLine2: "",
                province: "",
                city: "",
                barangay: "",
                postalCode: ""
            });
        } catch (error) {
            console.error('Error submitting contract:', error);
            alert(`Error submitting contract: ${error.message}`);
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: theme.palette.background.default, color: theme.palette.text.primary, p: 2 }}>
            <Typography variant="h4" fontWeight="bold" color="primary.main" mb={2}>Booking</Typography>

            {!itemCount ? (
                <Paper elevation={3} sx={{ maxWidth: 400, mx: "auto", p: 4, borderRadius: 3, backgroundColor: theme.palette.background.paper, textAlign: "center" }}>
                    <Typography variant="body1" fontWeight="bold" fontSize="1.1rem" mb={2}>How many items do you want to book?</Typography>
                    <Box display="flex" justifyContent="center">
                        <TextField type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} size="small" sx={{ mb: 2, width: '120px', '& input': { textAlign: 'center' } }} />
                    </Box>
                    <Button variant="contained" onClick={handleCountSubmit} sx={{ width: '200px' }}>Proceed</Button>
                </Paper>
            ) : (
                <Box>
                    <Paper elevation={3} sx={{ maxWidth: 700, mx: "auto", p: 4, borderRadius: 3, backgroundColor: theme.palette.background.paper }}>
                        <Typography variant="h6" fontWeight="bold" align="center" mb={3}>Delivery Address</Typography>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <TextField 
                                label="Address Line 1 (House/Unit/Building No./Street)" 
                                fullWidth 
                                size="small" 
                                value={address.addressLine1} 
                                onChange={(e) => handleAddressChange("addressLine1", e.target.value)} 
                            />
                            <TextField 
                                label="Address Line 2 (Optional)" 
                                fullWidth 
                                size="small" 
                                value={address.addressLine2} 
                                onChange={(e) => handleAddressChange("addressLine2", e.target.value)} 
                            />
                            <Box display="flex" gap={2}>
                                <TextField 
                                    label="Province" 
                                    fullWidth 
                                    size="small" 
                                    value={address.province} 
                                    onChange={(e) => handleAddressChange("province", e.target.value)} 
                                />
                                <TextField 
                                    label="City" 
                                    fullWidth 
                                    size="small" 
                                    value={address.city} 
                                    onChange={(e) => handleAddressChange("city", e.target.value)} 
                                />
                            </Box>
                            <Box display="flex" gap={2}>
                                <TextField 
                                    label="Barangay" 
                                    fullWidth 
                                    size="small" 
                                    value={address.barangay} 
                                    onChange={(e) => handleAddressChange("barangay", e.target.value)} 
                                />
                                <TextField 
                                    label="Postal Code" 
                                    fullWidth 
                                    size="small" 
                                    value={address.postalCode} 
                                    onChange={(e) => handleAddressChange("postalCode", e.target.value)} 
                                />
                            </Box>
                        </Box>
                    </Paper>

                    {contracts.map((contract, index) => (
                        <Paper key={index} elevation={3} sx={{ maxWidth: 700, mx: "auto", mt: 4, p: 4, pt: 2, borderRadius: 3, backgroundColor: theme.palette.background.paper, position: "relative" }}>
                            <IconButton size="small" onClick={() => deleteContract(index)} sx={{ position: "absolute", top: 8, right: 8, color: theme.palette.grey[600] }} aria-label="delete form">
                                <CloseIcon />
                            </IconButton>

                            <Typography variant="h6" fontWeight="bold" align="center" mb={3}>Delivery Information {index + 1}</Typography>

                            <Box display="flex" flexDirection="column" gap={2} mb={2}>
                                <TextField 
                                    label="Luggage Owner" 
                                    fullWidth 
                                    size="small" 
                                    value={contract.luggage_owner} 
                                    onChange={(e) => handleInputChange(index, "luggage_owner", e.target.value)} 
                                />
                                <TextField 
                                    label="Case Number" 
                                    fullWidth 
                                    size="small" 
                                    value={contract.case_number} 
                                    onChange={(e) => handleInputChange(index, "case_number", e.target.value)} 
                                />
                                <Box display="flex" gap={2}>
                                    <TextField 
                                        label="Contact Number" 
                                        size="small" 
                                        value={contract.contact_number} 
                                        onChange={(e) => handleInputChange(index, "contact_number", e.target.value)} 
                                        sx={{ width: '50%' }}
                                    />
                                    <TextField 
                                        label="Weight (kg)" 
                                        type="number"
                                        size="small" 
                                        value={contract.weight} 
                                        onChange={(e) => handleInputChange(index, "weight", e.target.value)} 
                                        InputProps={{
                                            endAdornment: <Typography variant="body2">kg</Typography>
                                        }}
                                        sx={{ width: '50%' }}
                                    />
                                </Box>
                                <TextField 
                                    label="Item Description" 
                                    fullWidth 
                                    size="small" 
                                    value={contract.item_description} 
                                    onChange={(e) => handleInputChange(index, "item_description", e.target.value)} 
                                />
                                <TextField 
                                    label="Other Details" 
                                    fullWidth 
                                    size="small" 
                                    value={contract.other_details} 
                                    onChange={(e) => handleInputChange(index, "other_details", e.target.value)} 
                                />
                                <Box>
                                    <Typography variant="body2" mb={1}>Upload Image</Typography>
                                    <input type="file" accept="image/*" onChange={(e) => handleImageChange(index, e.target.files[0])} />
                                    {contract.image && <Typography variant="body2" mt={1}>Selected file: {contract.image.name}</Typography>}
                                </Box>
                            </Box>

                            <Box display="flex" justifyContent="center" mt={2}>
                                <Button variant="contained" size="small" sx={{ bgcolor: "#4a4a4a", color: "#fff", "&:hover": { bgcolor: "#333" } }} onClick={() => clearSingleContract(index)}>Clear Contract</Button>
                            </Box>
                        </Paper>
                    ))}

                    <Box display="flex" justifyContent="center" mt={4} gap={2}>
                        <Button variant="outlined" onClick={addContract}>Add Another Form</Button>
                        <Button variant="contained" onClick={handleSubmit}>Send Contract</Button>
                    </Box>
                </Box>
            )}

            <Box textAlign="center" mt={6}>
                <Typography variant="h6" fontWeight="bold">Partners</Typography>
                <Box display="flex" justifyContent="center" gap={4} mt={2}>
                    <Image src="/brand-3.png" alt="AirAsia" width={60} height={60} />
                    <Image src="/brand-4.png" alt="Philippine Airlines" width={60} height={60} />
                    <Image src="/brand-5.png" alt="Cebu Pacific" width={60} height={60} />
                </Box>
            </Box>
        </Box>
    );
}