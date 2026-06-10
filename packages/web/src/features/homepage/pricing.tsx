import { CardContent } from "@/components/ui/card";
import { motion } from "motion/react"



export function PricingPage() {
    return (
        <div className="bg-black flex min-h-svh w-full flex-col items-center justify-center gap-6 p-6 md:p-10">
            <CardContent className = "border-2 border-gray-700 rounded-lg flex flex-col items-center justify-center gap-4 p-6">
                <h1 className="text-4xl font-bold text-white">Pricing</h1>
                <p className="text-lg text-gray-300">Choose the plan that fits your needs.</p>
            </CardContent>
            <div className="flex flex-row gap-8 justify-center w-full">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="border-2 border-gray-700 rounded-lg flex flex-col items-center justify-center gap-4 p-6 cursor-pointer hover:bg-gray-800 transition-colors duration-300 w-80" onClick={() => alert('Free Plan selected!')}>
                    <h2 className="text-2xl font-bold text-white">Free Plan</h2>
                    <p className="text-lg text-gray-300">Perfect for individuals getting started.</p>
                    <ul className="list-disc list-inside text-gray-300">
                        <li>Basic features</li>
                        <li>Limited support</li>
                        <li>Community access</li>
                    </ul>
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="border-2 border-gray-700 rounded-lg flex flex-col items-center justify-center gap-6 p-6 cursor-pointer hover:bg-gray-800 transition-colors duration-300 w-80" onClick={() => alert('Pro Plan selected!')}>
                    <h2 className="text-2xl font-bold text-white">Pro Plan</h2>
                    <p className="text-lg text-gray-300">Ideal for professionals and small teams.</p>
                    <ul className="list-disc list-inside text-gray-300">
                        <li>All Free Plan features</li>
                        <li>Priority support</li>
                        <li>Advanced analytics</li>
                    </ul>
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.95 }} className="border-2 border-gray-700 rounded-lg flex flex-col items-center justify-center gap-6 p-6 cursor-pointer hover:bg-gray-800 transition-colors duration-300 w-80" onClick={() => alert('Enterprise Plan selected!')}>
                    <h2 className="text-2xl font-bold text-white">Enterprise Plan</h2>
                    <p className="text-lg text-gray-300">Tailored solutions for large organizations.</p>
                    <ul className="list-disc list-inside text-gray-300">
                        <li>All Pro Plan features</li>
                        <li>Dedicated account manager</li>
                        <li>Custom integrations</li>
                    </ul>
                </motion.button>
            </div>
        </div>      
    )
}