"use client";
import * as React from "react";
import { z } from "zod";
import { getPrice } from "@/utils/getPrice";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Rubik } from "next/font/google";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  type: z.string().min(1, { message: "בחר סוג פרגולה" }),
  width: z.string().min(1, { message: "רוחב חובה" }),
  height: z.string().min(1, { message: "גובה חובה" }),
  discount: z.string().optional(),
});

type CardWithFormProps = {
  pergolaTypes: string[];
};

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          // color of the text inside the field
          color: "white",
          // border color on hover
          "&:hover:not(.Mui-focused)": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "yellow",
            },
          },
          "& label": {
            left: "unset",
            right: "1.75rem",
            transformOrigin: "right",
            fontSize: "1rem",
          },
          "& legend": {
            textAlign: "right",
            fontSize: "0.85rem",
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          // color of the label text
          color: "white",
          // color of the label text when focused
          "&.Mui-focused": {
            color: "white", // Change input label color on focus
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: "white",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          // color of the border when focused
          "&.Mui-focused": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "white",
            },
          },
        },
        notchedOutline: {
          // color of the border normal state
          borderColor: "gray",
        },
      },
    },
  },
});

export function CardWithForm({ pergolaTypes }: CardWithFormProps) {
  const [price, setPrice] = React.useState<string | undefined>(undefined);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [discountedPrice, setDiscountedPrice] = React.useState<
    string | undefined
  >(undefined);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      width: "",
      height: "",
      discount: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    const priceData = await getPrice({
      width: values.width,
      height: values.height,
      type: values.type,
      discount: values.discount,
    });

    if (!priceData.price) {
      setError(priceData.error?.message);
      setPrice(undefined);
      setDiscountedPrice(undefined);
      return;
    }

    if (!priceData.error) {
      setPrice(priceData.price);
      setDiscountedPrice(priceData.discountedPrice);
      setError(undefined);
      return;
    }

    if (!priceData.discountedPrice && !priceData.error) {
      setPrice(priceData.price);
      setError(undefined);
      return;
    }

    if (!priceData.discountedPrice && priceData.error) {
      setPrice(priceData.price);
      setDiscountedPrice(undefined);
      setError(priceData.error.message);
      return;
    }

    // if (priceData.price) {
    //   setPrice(priceData.price);
    //   setError(undefined);
    // } else {
    //   setError(priceData.error?.message);
    //   setPrice(undefined);
    // }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-primary text-center">מחשבון מחיר</CardTitle>
        {/* <CardDescription>Deploy your new project in one-click.</CardDescription> */}
      </CardHeader>
      <CardContent>
        {/*  */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>סוג פרגולה</FormLabel>
                  <Select
                    dir="rtl"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר סוג" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      ref={(ref) => {
                        if (!ref) return;
                        ref.ontouchend = (e) => {
                          e.preventDefault();
                        };
                      }}
                    >
                      {pergolaTypes.map((type) => {
                        return (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="width"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>רוחב</FormLabel>
                  <FormControl>
                    <Input placeholder="רוחב" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>אורך (פתיחה)/ גובה</FormLabel>
                  <FormControl>
                    <Input placeholder="גובה" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>אחוז הנחה</FormLabel>
                  <FormControl>
                    <Input placeholder="אחוז הנחה" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full bg-secondary hover:bg-primary"
              type="submit"
            >
              חשב
            </Button>
          </form>
        </Form>

        {price && (
          <p className="mt-4 text-center text-green-700">{`מחיר: ${price}`}</p>
        )}
        {discountedPrice && (
          <p className="text-center text-orange-700">{`מחיר עם הנחה: ${discountedPrice}`}</p>
        )}
        {error && <p className=" text-center text-red-700">{error}</p>}

        {/*  */}
      </CardContent>
    </Card>
  );
}
