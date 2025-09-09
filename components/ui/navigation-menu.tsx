"use client";

import * as React from "react";
import Link from "next/link";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const NavigationMenu = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, children, ...props }, ref) => {
  const [activeItem, setActiveItem] = React.useState<string | null>(null);

  return (
    <nav
      ref={ref}
      className={cn(
        "relative z-10 flex max-w-max flex-1 items-center justify-center",
        className,
      )}
      onMouseLeave={() => setActiveItem(null)}
      {...props}
    >
      <NavigationMenuProvider value={{ activeItem, setActiveItem }}>
        {children}
      </NavigationMenuProvider>
    </nav>
  );
});
NavigationMenu.displayName = "NavigationMenu";

const NavigationMenuContext = React.createContext<{
  activeItem: string | null;
  setActiveItem: (item: string | null) => void;
}>({
  activeItem: null,
  setActiveItem: () => {},
});

const NavigationMenuProvider = NavigationMenuContext.Provider;

const useNavigationMenu = () => {
  const context = React.useContext(NavigationMenuContext);
  if (!context) {
    throw new Error("useNavigationMenu must be used within NavigationMenu");
  }
  return context;
};

const NavigationMenuList = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(
      "group flex flex-1 list-none items-center justify-center space-x-1",
      className,
    )}
    {...props}
  />
));
NavigationMenuList.displayName = "NavigationMenuList";

const NavigationMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement> & { value?: string }
>(({ className, children, value, ...props }, ref) => {
  const { activeItem, setActiveItem } = useNavigationMenu();
  const isActive = value && activeItem === value;

  return (
    <li
      ref={ref}
      className={cn("relative", className)}
      onMouseEnter={() => value && setActiveItem(value)}
      {...props}
    >
      <NavigationMenuItemProvider
        value={{ isActive: isActive || false, value }}
      >
        {children}
      </NavigationMenuItemProvider>
    </li>
  );
});
NavigationMenuItem.displayName = "NavigationMenuItem";

const NavigationMenuItemContext = React.createContext<{
  isActive: boolean;
  value?: string;
}>({
  isActive: false,
});

const NavigationMenuItemProvider = NavigationMenuItemContext.Provider;

const useNavigationMenuItem = () => {
  const context = React.useContext(NavigationMenuItemContext);
  if (!context) {
    throw new Error(
      "useNavigationMenuItem must be used within NavigationMenuItem",
    );
  }
  return context;
};

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
);

const NavigationMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    showChevron?: boolean;
  }
>(({ className, children, showChevron = true, ...props }, ref) => {
  const { isActive } = useNavigationMenuItem();

  return (
    <button
      ref={ref}
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      data-state={isActive ? "open" : "closed"}
      aria-expanded={isActive}
      {...props}
    >
      {children}
      {showChevron && (
        <ChevronDown
          className={cn(
            "relative top-[1px] ml-1 h-3 w-3 transition duration-200",
            isActive && "rotate-180",
          )}
          aria-hidden="true"
        />
      )}
    </button>
  );
});
NavigationMenuTrigger.displayName = "NavigationMenuTrigger";

const NavigationMenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isActive } = useNavigationMenuItem();

  if (!isActive) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute left-0 top-full mt-2 w-full animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        className,
      )}
      data-state={isActive ? "open" : "closed"}
      {...props}
    >
      <div className="w-full overflow-hidden rounded-md border bg-popover p-6 text-popover-foreground shadow-lg">
        {props.children}
      </div>
    </div>
  );
});
NavigationMenuContent.displayName = "NavigationMenuContent";

const NavigationMenuLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { asChild?: boolean }
>(({ className, href, children, asChild, ...props }, ref) => {
  if (asChild) {
    return (
      <div
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className,
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <Link
      ref={ref}
      href={href || "#"}
      className={cn(
        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
});
NavigationMenuLink.displayName = "NavigationMenuLink";

const NavigationMenuViewport = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
      className,
    )}
    {...props}
  />
));
NavigationMenuViewport.displayName = "NavigationMenuViewport";

const NavigationMenuIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className,
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </div>
));
NavigationMenuIndicator.displayName = "NavigationMenuIndicator";

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};
