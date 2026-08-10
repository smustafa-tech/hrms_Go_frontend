import React, { useState, useEffect, useCallback, createContext, useContext, forwardRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import styles from "./Carousel.module.css";

// Context
const CarouselContext = createContext(null);

export function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) throw new Error("useCarousel must be used inside <Carousel>");
  return context;
}

// Main Carousel
export const Carousel = forwardRef(
  ({ orientation = "horizontal", opts, children, className = "", setApi, ...props }, ref) => {
    const [carouselRef, api] = useEmblaCarousel(
      { ...opts, axis: orientation === "horizontal" ? "x" : "y" }
    );
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const onSelect = useCallback((api) => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
    const scrollNext = useCallback(() => api?.scrollNext(), [api]);

    useEffect(() => {
      if (!api) return;
      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);
      return () => api.off("select", onSelect);
    }, [api, onSelect]);

    useEffect(() => {
      if (api && setApi) setApi(api);
    }, [api, setApi]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
          orientation,
        }}
      >
        <div ref={ref} className={`${styles.carouselWrapper} ${className}`} {...props}>
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);

// CarouselContent
export const CarouselContent = forwardRef(({ children, className = "", ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();
  return (
    <div ref={carouselRef} className={styles.carouselViewport}>
      <div
        ref={ref}
        className={`${styles.carouselContainer} ${
          orientation === "horizontal" ? styles.horizontal : styles.vertical
        } ${className}`}
        {...props}
      >
        {children}
      </div>
    </div>
  );
});

// CarouselItem
export const CarouselItem = forwardRef(({ children, className = "", ...props }, ref) => {
  const { orientation } = useCarousel();
  return (
    <div
      ref={ref}
      className={`${styles.carouselItem} ${
        orientation === "horizontal" ? styles.itemHorizontal : styles.itemVertical
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

// Carousel Buttons
export const CarouselPrevious = forwardRef(({ className = "", ...props }, ref) => {
  const { scrollPrev, canScrollPrev, orientation } = useCarousel();
  return (
    <button
      ref={ref}
      className={`${styles.carouselButton} ${className}`}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      aria-label="Previous slide"
      style={orientation === "horizontal" ? { left: "-40px" } : { top: "-40px", transform: "rotate(90deg)" }}
      {...props}
    >
      <ArrowLeft />
    </button>
  );
});

export const CarouselNext = forwardRef(({ className = "", ...props }, ref) => {
  const { scrollNext, canScrollNext, orientation } = useCarousel();
  return (
    <button
      ref={ref}
      className={`${styles.carouselButton} ${className}`}
      disabled={!canScrollNext}
      onClick={scrollNext}
      aria-label="Next slide"
      style={orientation === "horizontal" ? { right: "-40px" } : { bottom: "-40px", transform: "rotate(90deg)" }}
      {...props}
    >
      <ArrowRight />
    </button>
  );
});
