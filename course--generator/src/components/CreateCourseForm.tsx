"use client";    // import React from "react";
import React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { z } from "zod";
import { createChaptersSchema } from "@/validators/course";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Plus, Trash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

// import SubscriptionAction from "./SubscriptionAction";

type Props = { isPro: boolean };

type Input = z.infer<typeof createChaptersSchema> & {
  courseCode: string;
  branch: string;
  category: string;
};

const CreateCourseForm = ({ isPro }: Props) => {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: createChapters, isLoading } = useMutation({
    mutationFn: async ({ title, units, courseCode, branch, category }: Input) => {
      const response = await axios.post("/api/course/createChapters", {
        title,
        units,
        courseCode,
        branch,
        category,
      });
      return response.data;
    },
  });
  
 

  const form = useForm<Input>({
    resolver: zodResolver(createChaptersSchema),
    defaultValues: {
      title: "",
      units: ["", "", ""],
      courseCode: "", // Initial value for courseCode
      branch: "COMPUTER SCIENCE",
      category: "UG",
    },
  });

  function onSubmit(data: Input) {
    if (data.units.some((unit) => unit === "")) {
      toast({
        title: "Error",
        description: "Please fill all the units",
        variant: "destructive",
      });
      return;
    }
    createChapters(data, {
      onSuccess: ({ course_id }) => {
        toast({
          title: "Success",
          description: "Course created successfully",
        });
        router.push(`/create/${course_id}`);
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      },
    });
  }

  form.watch();
  // console.log(course.branch);
  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mt-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-col items-start w-full sm:items-center sm:flex-row">
                  <FormLabel className="flex-[1] text-xl">Title</FormLabel>
                  <FormControl className="flex-[6]">
                    <Input
                      placeholder="Enter the main topic of the course"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />
          
      <FormField
        control={form.control}
        name="courseCode"
        render={({ field }) => {
          return (
            <FormItem className="flex flex-col items-start w-full sm:items-center sm:flex-row">
              <FormLabel className="flex-[1] text-xl">Subject Code</FormLabel>
              <FormControl className="flex-[6]">
                <Input
                  placeholder="Enter the Subject code"
                  {...field}
                />
              </FormControl>
            </FormItem>
          );
        }}
      />
  
<FormField
  control={form.control}
  name="branch"
  render={({ field }) => {
    return (
      <FormItem className="flex flex-col items-start w-full sm:items-center sm:flex-row">
        <FormLabel className="flex-[1] text-xl">Branch</FormLabel>
        <FormControl className="border rounded padding flex-[6]">
          <select
            {...field}
            className="w-full"
          >
            <option value="COMPUTER SCIENCE">COMPUTER SCIENCE</option>
                <option value="INFORMATION TECHNOLOGY">INFORMATION TECHNOLOGY</option>
                <option value="ELECTRONICS AND COMMUNICATION">ELECTRONICS AND COMMUNICATION</option>
                <option value="ELECTRICAL ENGINEERING">ELECTRICAL ENGINEERING</option>
                <option value="MECHANICAL ENGINEERING">MECHANICAL ENGINEERING</option>
                <option value="CIVIL ENGINEERING">CIVIL ENGINEERING</option>
              </select>
          
        </FormControl>
      </FormItem>
    );
  }}
/>
<FormField
  control={form.control}
  name="category"
  render={({ field }) => {
    return (
      <FormItem className="flex flex-col items-start w-full sm:items-center sm:flex-row">
        <FormLabel className="flex-[1] text-xl">Category</FormLabel>
        <FormControl className="border rounded flex-[6]">
          <select
            {...field}
            className="w-full"
          >
            <option value="Under Graduate">UG</option>
            <option value="Post Graduate">PG</option>
          </select>
        </FormControl>
      </FormItem>
    );
  }}
/>


    
          <AnimatePresence>
            {form.watch("units").map((_, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{
                    opacity: { duration: 0.2 },
                    height: { duration: 0.2 },
                  }}
                >
                  <FormField
                    key={index}
                    control={form.control}
                    name={`units.${index}`}
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-col items-start w-full sm:items-center sm:flex-row">
                          <FormLabel className="flex-[1] text-xl">
                            Unit {index + 1}
                          </FormLabel>
                          <FormControl className="flex-[6]">
                            <Input
                              placeholder="Enter subtopic of the course"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>

          <div className="flex items-center justify-center mt-4">
            <Separator className="flex-[1]" />
            <div className="mx-4">
              <Button
                type="button"
                variant="secondary"
                className="font-semibold"
                onClick={() => {
                  form.setValue("units", [...form.watch("units"), ""]);
                }}
              >
                Add Unit
                <Plus className="w-4 h-4 ml-2 text-green-500" />
              </Button>

              <Button
                type="button"
                variant="secondary"
                className="font-semibold ml-2"
                onClick={() => {
                  form.setValue("units", form.watch("units").slice(0, -1));
                }}
              >
                Remove Unit
                <Trash className="w-4 h-4 ml-2 text-red-500" />
              </Button>
            </div>
            <Separator className="flex-[1]" />
          </div>
          <Button
            disabled={isLoading}
            type="submit"
            className="w-full mt-6"
            size="lg"
          >
            Lets Go!
          </Button>
        </form>
      </Form>
      {!isPro}
    </div>
  );
};



// "use client";
// // import React from "react";
// import React from "react";
// import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
// import { z } from "zod";
// import { createChaptersSchema } from "@/validators/course";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Input } from "./ui/input";
// import { Separator } from "./ui/separator";
// import { Button } from "./ui/button";
// import { Plus, Trash } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useMutation } from "@tanstack/react-query";
// import axios from "axios";
// import { useToast } from "./ui/use-toast";
// import { useRouter } from "next/navigation";

// // import SubscriptionAction from "./SubscriptionAction";

// type Props = { isPro: boolean };

// type Input = z.infer<typeof createChaptersSchema> & {
//   courseCode: string;
//   branch: string;
//   category: string;
// };

// const CreateCourseForm = ({ isPro }: Props) => {
//   const router = useRouter();
//   const { toast } = useToast();
//   const { mutate: createChapters, isLoading } = useMutation({
//     mutationFn: async ({ title, units, courseCode, branch, category }: Input) => {
//       const response = await axios.post("/api/course/createChapters", {
//         title,
//         units,
//         courseCode,
//         branch,
//         category,
//       });
//       return response.data;
//     },
//   });
  
 

//   const form = useForm<Input>({
//     resolver: zodResolver(createChaptersSchema),
//     defaultValues: {
//       title: "",
//       units: ["", "", ""],
//       courseCode: "", // Initial value for courseCode
//       branch: "COMPUTER SCIENCE",
//       category: "UG",
//     },
//   });

//   function onSubmit(data: Input) {
//     if (data.units.some((unit) => unit === "")) {
//       toast({
//         title: "Error",
//         description: "Please fill all the units",
//         variant: "destructive",
//       });
//       return;
//     }
//     createChapters(data, {
//       onSuccess: ({ course_id }) => {
//         toast({
//           title: "Success",
//           description: "Course created successfully",
//         });
//         router.push(/create/${course_id});
//       },
//       onError: (error) => {
//         console.error(error);
//         toast({
//           title: "Error",
//           description: "Something went wrong",
//           variant: "destructive",
//         });
//       },
//     });
//   }

//   form.watch();
//   // console.log(course.branch);
//   return (
//     <div className="w-full">
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mt-4">
//           <FormField
//             control={form.control}
//             name="title"
//             render={({ field }) => {
//               return (
//                 <FormItem className="flex flex-col items-start w-full sm:items-center sm:flex-row">
//                   <FormLabel className="flex-[1] text-xl">Title</FormLabel>
//                   <FormControl className="flex-[6]">
//                     <Input
//                       placeholder="Enter the main topic of the course"
//                       {...field}
//                     />
//                   </FormControl>
//                 </FormItem>
//               );
//             }}
//           />
          
//       <FormField
//         control={form.control}
//         name="courseCode"
//         render={({ field }) => {
//           return (
//             <FormItem className="flex flex-col items-start w-full sm:items-center sm:flex-row">
//               <FormLabel className="flex-[1] text-xl">Subject Code</FormLabel>
//               <FormControl className="flex-[6]">
//                 <Input
//                   placeholder="Enter the Subject code"
//                   {...field}
//                 />
//               </FormControl>
//             </FormItem>
//           );
//         }}
//       />
  
// <FormField
//   control={form.control}
//   name="branch"
//   render={({ field }) => {
//     return (
//       <FormItem className="flex flex-col items-start w-full sm:items-center sm:flex-row">
//         <FormLabel className="flex-[1] text-xl">Branch</FormLabel>
//         <FormControl className="border rounded padding flex-[6]">
//           <select
//             {...field}
//             className="w-full"
//           >
//             <option value="COMPUTER SCIENCE">COMPUTER SCIENCE</option>
//                 <option value="INFORMATION TECHNOLOGY">INFORMATION TECHNOLOGY</option>
//                 <option value="ELECTRONICS AND COMMUNICATION">ELECTRONICS AND COMMUNICATION</option>
//                 <option value="ELECTRICAL ENGINEERING">ELECTRICAL ENGINEERING</option>
//                 <option value="MECHANICAL ENGINEERING">MECHANICAL ENGINEERING</option>
//                 <option value="CIVIL ENGINEERING">CIVIL ENGINEERING</option>
//               </select>
          
//         </FormControl>
//       </FormItem>
//     );
//   }}
// />
// <FormField
//   control={form.control}
//   name="category"
//   render={({ field }) => {
//     return (
//       <FormItem className="flex flex-col items-start w-full sm:items-center sm:flex-row">
//         <FormLabel className="flex-[1] text-xl">Category</FormLabel>
//         <FormControl className="border rounded flex-[6]">
//           <select
//             {...field}
//             className="w-full"
//           >
//             <option value="Under Graduate">UG</option>
//             <option value="Post Graduate">PG</option>
//           </select>
//         </FormControl>
//       </FormItem>
//     );
//   }}
// />


    
//           <AnimatePresence>
//             {form.watch("units").map((_, index) => {
//               return (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: "auto" }}
//                   exit={{ opacity: 0, height: 0 }}
//                   transition={{
//                     opacity: { duration: 0.2 },
//                     height: { duration: 0.2 },
//                   }}
//                 >
//                   <FormField
//                     key={index}
//                     control={form.control}
//                     name={units.${index}}
//                     render={({ field }) => {
//                       return (
//                         <FormItem className="flex flex-col items-start w-full sm:items-center sm:flex-row">
//                           <FormLabel className="flex-[1] text-xl">
//                             Unit {index + 1}
//                           </FormLabel>
//                           <FormControl className="flex-[6]">
//                             <Input
//                               placeholder="Enter subtopic of the course"
//                               {...field}
//                             />
//                           </FormControl>
//                         </FormItem>
//                       );
//                     }}
//                   />
//                 </motion.div>
//               );
//             })}
//           </AnimatePresence>

//           <div className="flex items-center justify-center mt-4">
//             <Separator className="flex-[1]" />
//             <div className="mx-4">
//               <Button
//                 type="button"
//                 variant="secondary"
//                 className="font-semibold"
//                 onClick={() => {
//                   form.setValue("units", [...form.watch("units"), ""]);
//                 }}
//               >
//                 Add Unit
//                 <Plus className="w-4 h-4 ml-2 text-green-500" />
//               </Button>

//               <Button
//                 type="button"
//                 variant="secondary"
//                 className="font-semibold ml-2"
//                 onClick={() => {
//                   form.setValue("units", form.watch("units").slice(0, -1));
//                 }}
//               >
//                 Remove Unit
//                 <Trash className="w-4 h-4 ml-2 text-red-500" />
//               </Button>
//             </div>
//             <Separator className="flex-[1]" />
//           </div>
//           <Button
//             disabled={isLoading}
//             type="submit"
//             className="w-full mt-6"
//             size="lg"
//           >
//             Lets Go!
//           </Button>
//         </form>
//       </Form>
//       {!isPro}
//     </div>
//   );
// };

// export default CreateCourseForm;

////////////////////////////////////
