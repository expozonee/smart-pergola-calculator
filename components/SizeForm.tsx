"use client";
import * as React from "react";
import { z } from "zod";
import { getPrice } from "@/utils/getPrice";
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
import { Loader } from "./loader/loader";

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
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
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

    setIsLoading(true);

    const priceData = await getPrice({
      width: values.width,
      height: values.height,
      type: values.type,
      discount: values.discount,
    });

    setIsLoading(false);

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
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-primary text-center">מחשבון מחיר</CardTitle>
      </CardHeader>
      <CardContent>
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
                    <Input
                      inputMode="numeric"
                      placeholder="רוחב"
                      {...field}
                      onFocus={(e) => e.target.select()}
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
                      placeholder="גובה"
                      {...field}
                      onFocus={(e) => e.target.select()}
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
                      placeholder="אחוז הנחה"
                      {...field}
                      onFocus={(e) => e.target.select()}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="relative w-full bg-secondary hover:bg-primary disabled:opacity-75"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <Loader color="white" /> : "חשב"}
            </Button>
          </form>
        </Form>

        {price && (
          <p className="mt-4 text-center text-green-700">{`מחיר: ${price}`}</p>
        )}
        {discountedPrice && (
          <p className="text-center text-orange-700">{`מחיר עם הנחה: ${discountedPrice}`}</p>
        )}
        {error && (
          <p className={`${!price && "mt-3"} text-center text-red-700`}>
            {error}
          </p>
        )}

        {/*  */}
      </CardContent>
    </Card>
  );
}
