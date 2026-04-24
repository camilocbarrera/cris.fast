import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 max-w-screen overflow-x-clip bg-background px-2 pt-2">
      <div className="screen-line-top screen-line-bottom relative mx-auto flex h-12 items-center justify-between gap-2 border-x border-line px-3 sm:gap-4 md:max-w-3xl">
        <span
          aria-hidden
          className="absolute -top-[4.5px] -left-[4.5px] z-20 block size-2 border border-line bg-background"
        />
        <span
          aria-hidden
          className="absolute -top-[4.5px] -right-[4.5px] z-20 block size-2 border border-line bg-background"
        />

        <a
          href="/"
          className="font-serif text-base italic leading-none tracking-tight"
        >
          Cris
        </a>

        <ThemeToggle className="size-8" />
      </div>
    </header>
  )
}
