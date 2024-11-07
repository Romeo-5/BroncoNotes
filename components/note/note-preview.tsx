"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import { pdfjs, Document, Page } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function NotePreview({ file }: { file: string }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const isPDF = (fileUrl: string): boolean => {
    const url = new URL(fileUrl);
    const path = url.pathname; // This gives the path without the query string

    // Extract the file extension
    const extension = path.split(".").pop()?.toLowerCase();
    return extension === "pdf";
  };

  // Callback when document is loaded successfully
  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setCount(numPages);
  }

  return (
    <div className="h-fit mx-auto flex flex-col items-center">
      {isPDF(file) ? (
        <Carousel setApi={setApi} className="w-[459px]">
          <CarouselContent>
            {Array.from({ length: count }).map((_, index) => (
              <CarouselItem key={index}>
                <Card className="aspect-[17/22]">
                  <CardContent className="w-full h-full grid place-content-center p-0">
                    <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                      <Page
                        pageIndex={index}
                        width={340}
                        className="round-pdf rounded-lg"
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                      />
                    </Document>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <Card className="aspect-[17/22] w-[459px]">
          <CardContent className="w-full h-full grid place-content-center p-0">
            <Image
              src={file}
              alt={file}
              width={459}
              height={594}
              className="rounded-lg min-w-full aspect-[17/22]"
              priority
            />
          </CardContent>
        </Card>
      )}
      <div className="py-2 text-center text-sm text-muted-foreground">
        Page {current} of {count}
      </div>
    </div>
  );
}
