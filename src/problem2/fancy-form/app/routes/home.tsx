import { useState } from "react";
import {
  Button,
  TextField,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { InputField } from "~/components/form-controls/InputField";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export default function Home() {

  const schema = yup.object().shape({
    amountToSend: yup.string().required('Amount is required'),
});

  const { handleSubmit, control } = useForm({
    defaultValues: {
      amountToSend: ''
    },
    resolver: yupResolver(schema),
  });

  const [amountToReceive, setAmountToReceive] = useState(0);
  const [loading, setLoading] = useState(false);

  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");

  const rates = {
    USD: { EUR: 0.92, VND: 25000, JPY: 150 },
    EUR: { USD: 1.09, VND: 27000, JPY: 162 },
    VND: { USD: 0.00004, EUR: 0.000037, JPY: 0.006 },
    JPY: { USD: 0.0067, EUR: 0.0061, VND: 166 },
  };

  const handleSwapCurrency = (data: any) => {
    setLoading(true);

    new Promise((resolve) => {
      setTimeout(() => {
        const rate = rates[fromCurrency]?.[toCurrency] ?? 1;
        const converted = Number(data.amountToSend) * rate;
        resolve(Number(converted.toFixed(2)));
      }, 1500);
    })
      .then((result: any) => {
        setAmountToReceive(result);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const currencyOptions = Object.keys(rates);

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center">
      <div>
        <h1 className="mb-4 text-xl font-semibold text-center">💱 Swap Currency</h1>

        <div className="flex items-start">
          <form
            className="flex flex-col mr-6"
            onSubmit={handleSubmit(handleSwapCurrency)}
          >
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>From</InputLabel>
              <Select
                value={fromCurrency}
                label="From"
                onChange={(e) => setFromCurrency(e.target.value)}
              >
                {currencyOptions.map((cur) => (
                  <MenuItem key={cur} value={cur}>
                    {cur}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>To</InputLabel>
              <Select
                value={toCurrency}
                label="To"
                onChange={(e) => setToCurrency(e.target.value)}
              >
                {currencyOptions.map((cur) => (
                  <MenuItem key={cur} value={cur}>
                    {cur}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <InputField
              label="Amount to send"
              type="number"
              sx={{ mb: 3 }}
              name="amountToSend"
              control={control} 
              disabled={undefined}            
              />

            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {loading ? "Swapping..." : "Confirm Swap"}
            </Button>
          </form>

          <TextField
            label={`Amount to receive (${toCurrency})`}
            type="number"
            value={amountToReceive}
            sx={{ width: 220 }}
            InputProps={{ readOnly: true }}
          />
        </div>
      </div>
    </div>
  );
}
