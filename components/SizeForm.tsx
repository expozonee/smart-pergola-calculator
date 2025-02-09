"use client";
import * as React from "react";
import { z } from "zod";
import { getPrice } from "@/utils/getPrice";
import { Rubik } from "next/font/google";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export function CardWithForm({ pergolaTypes }: CardWithFormProps) {
  const [price, setPrice] = React.useState<string | undefined>(undefined);
  const [discountedPrice, setDiscountedPrice] = React.useState<
    string | undefined
  >(undefined);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [maxMinMsg, setMaxMinMsg] = React.useState<
    (React.JSX.Element | undefined)[] | undefined
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

    const formattedMessage = priceData.maxMinMsg
      ? priceData.maxMinMsg.split("\n").map((line, index) => {
          if (line === "") {
            return undefined;
          } else
            return (
              <li key={index}>
                {line}
                <br />
              </li>
            );
        })
      : undefined;

    if (!priceData.price) {
      setError(priceData.error?.message);
      setMaxMinMsg(undefined);
      setPrice(undefined);
      setDiscountedPrice(undefined);
      return;
    }

    if (!priceData.error) {
      setPrice(priceData.price);
      setDiscountedPrice(priceData.pricewithDiscount);
      setMaxMinMsg(formattedMessage);
      setError(undefined);
      return;
    }

    if (!priceData.pricewithDiscount && !priceData.error) {
      setPrice(priceData.price);
      setMaxMinMsg(formattedMessage);
      setError(undefined);
      return;
    }

    if (!priceData.pricewithDiscount && priceData.error) {
      setPrice(priceData.price);
      setMaxMinMsg(formattedMessage);
      setDiscountedPrice(undefined);
      setError(priceData.error.message);
      return;
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-primary text-center">מחשבון מחיר</CardTitle>
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
                    <SelectContent>
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
                    <Input
                      inputMode="numeric"
                      onFocus={(e) => e.target.select()}
                      placeholder="רוחב"
                      {...field}
                    />
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
                    <Input
                      inputMode="numeric"
                      onFocus={(e) => e.target.select()}
                      placeholder="גובה"
                      {...field}
                    />
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
                    <Input
                      inputMode="numeric"
                      onFocus={(e) => e.target.select()}
                      placeholder="אחוז הנחה"
                      {...field}
                    />
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
        {maxMinMsg && (
          <ul className="grid gap-2 list-disc w-[85%] mx-auto mt-1 text-[0.8rem] text-red-700">
            {maxMinMsg}
          </ul>
        )}
        {error && <p className="text-center text-red-700">{error}</p>}

        {/*  */}
      </CardContent>
    </Card>
  );
}
