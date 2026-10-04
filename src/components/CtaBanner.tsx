import Link from "next/link";

type CtaLink = {
  label: string;
  href: string;
  external?: boolean;
  newTab?: boolean;
  download?: boolean;
};

type CtaBannerProps = {
  title: string;
  text: string;
  primary: CtaLink;
  secondary?: CtaLink;
};

function CtaButton({
  link,
  variant,
}: {
  link: CtaLink;
  variant: "primary" | "secondary";
}) {
  const styles =
    variant === "primary"
      ? "bg-primary text-white shadow-sm hover:bg-primary-dark hover:shadow-md"
      : "border border-primary text-primary-dark hover:bg-primary/10";
  const className = `rounded-full px-8 py-3.5 text-center text-sm font-semibold transition-all ${styles}`;

  if (link.external) {
    return (
      <a
        href={link.href}
        className={className}
        download={link.download ? true : undefined}
        target={link.newTab ? "_blank" : undefined}
        rel={link.newTab ? "noopener noreferrer" : undefined}
      >
        {link.label}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}

export default function CtaBanner({
  title,
  text,
  primary,
  secondary,
}: CtaBannerProps) {
  return (
    <section className="px-6 pb-20 sm:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-surface px-6 py-12 text-center shadow-sm sm:px-12">
        <h2 className="font-heading text-2xl font-bold text-text sm:text-3xl">
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-text-muted">
          {text}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CtaButton link={primary} variant="primary" />
          {secondary && <CtaButton link={secondary} variant="secondary" />}
        </div>
      </div>
    </section>
  );
}
