"use client";

import { Fragment, useState } from "react";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Sparkles } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export default function PracticeTest() {
  // State for switches
  const [toggleMultipleChoice, setToggleMultipleChoice] = useState(true);
  const [toggleFreeResponse, setToggleFreeResponse] = useState(false);

  // Placeholder multiple choice questions
  // Current schema:
  //   * question: string = The text in the generated questions
  //   * answers: Array<string> = List of possible answers
  //   * correctAnswer: number = index of correct answer
  const exampleMCQ = [
    {
      question: `What's a skeleton's favorite snack?`,
      answers: [
        "Death",
        "Bones",
        "WHY MUST YOU FAIL ME SO OFTEN?!",
        "Ribs! Spare Ribs!",
      ],
      correctAnswer: 3,
    },
    {
      question: `What is the probability of getting this questions correct?`,
      answers: ["0%", "25%", "50%", "25%"],
      correctAnswer: 0,
    },
  ];

  // Placeholder free response questions
  // Just the text of the generated questions
  // Possibly store criteria for checking if answer is correct?
  //    -> As in, the response must contain the following phrase to be correct?
  //    -> Or, Create an example correct answer to prompt LLM to check answer?
  const exampleFRQ = [
    `Where did he come from? Where did he go? Where did he come from, Cotton-Eyed Joe?`,
    `Write an AI prompt that can be used to generate the exact text of this question.`,
  ];
  return (
    <div className="w-full pr-4 flex flex-col space-y-4">
      <Card className="w-fit h-24 self-center flex space-x-3 p-3">
        <div className="flex-1 flex flex-col items-start space-y-2">
          <div className="flex items-center space-x-2">
            <div className="whitespace-nowrap">Multiple Choice</div>
            <Switch
              checked={toggleMultipleChoice}
              onCheckedChange={() =>
                setToggleMultipleChoice(!toggleMultipleChoice)
              }
            />
          </div>
          <div className="flex items-center space-x-2">
            <div className="whitespace-nowrap">Questions</div>
            <Input
              disabled={!toggleMultipleChoice}
              type="number"
              min={0}
              max={30}
              defaultValue={10}
              className="max-w-fit"
            />
          </div>
        </div>
        <Separator orientation="vertical" />
        <div className="flex-1 flex flex-col items-start space-y-2">
          <div className="flex items-center space-x-2">
            <div className="whitespace-nowrap">Free Response</div>
            <Switch
              checked={toggleFreeResponse}
              onCheckedChange={() => setToggleFreeResponse(!toggleFreeResponse)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <div className="whitespace-nowrap overflow-ellipsis">Questions</div>
            <Input
              disabled={!toggleFreeResponse}
              type="number"
              min="0"
              max="10"
              defaultValue={2}
              className="max-w-fit"
            />
          </div>
        </div>
      </Card>
      <Button className="w-fit self-center flex items-center space-x-2">
        <div>Generate</div>
        <Sparkles />
      </Button>
      <div className="flex flex-col items-start space-y-4 overflow-auto">
        {/** Multiple Choice Questions */}
        <div className="text-xl font-semibold">Multiple Choice Questions</div>
        {exampleMCQ.map((value, index) => {
          return (
            <div key={index} className="flex flex-col space-y-2">
              <div className="font-semibold">
                {index + 1}. {value.question}
              </div>
              <RadioGroup className="ml-6">
                {value.answers.map((value, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={value} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`}>{value}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          );
        })}
        {/** Free Response Questions */}
        <div className="text-xl font-semibold">Free Response Questions</div>
        {exampleFRQ.map((value, index) => (
          <div key={index} className="w-full flex flex-col space-y-2">
            <Label
              htmlFor={`frq-${index + 1}`}
              className="text-base font-semibold"
            >
              {index + 1}. {value}
            </Label>
            <Textarea
              placeholder="Type your response here"
              id={`frq-${index + 1}`}
            />
          </div>
        ))}
      </div>
      <Button>Check Answers</Button>
    </div>
  );
}
