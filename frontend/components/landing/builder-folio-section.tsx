"use client";

import Link from "next/link";
import { ArrowUpRight, Code2, Sparkles, UsersRound } from "lucide-react";
import "./builder-folio-section.css";

const railMarks = ["✦", "◉", "↗", "⌘", "✳", "◌", "✦", "◎", "↗", "⌘", "✳", "◌"];

export function BuilderFolioSection() {
  return (
    <section className="builder-folio" aria-labelledby="builder-folio-title">
      <div className="builder-folio__rail builder-folio__rail--left" aria-hidden="true">
        {railMarks.map((mark, index) => <span key={`left-${index}`}>{mark}</span>)}
      </div>
      <div className="builder-folio__rail builder-folio__rail--right" aria-hidden="true">
        {railMarks.map((mark, index) => <span key={`right-${index}`}>{mark}</span>)}
      </div>

      <div className="builder-folio__doodle builder-folio__doodle--cup" aria-hidden="true">◒</div>
      <div className="builder-folio__doodle builder-folio__doodle--orbit" aria-hidden="true">◌</div>
      <div className="builder-folio__doodle builder-folio__doodle--spark" aria-hidden="true">✦</div>

      <div className="builder-folio__inner">
        <div className="builder-folio__nav" aria-hidden="true">
          <span>✦</span><span>build</span><span>meet</span><span>ship</span>
        </div>

        <div className="builder-folio__book">
          <div className="builder-folio__page builder-folio__page--top">
            <div className="builder-folio__copy">
              <p className="builder-folio__eyebrow">CollabSphere presents</p>
              <h2 id="builder-folio-title">Great software<br />feels <em>shared.</em></h2>
              <p className="builder-folio__location">Every timezone · One builder network</p>
            </div>

            <div className="builder-folio__scene" aria-hidden="true">
              <div className="builder-folio__browser">
                <div className="builder-folio__browser-top"><i /><i /><i /><b>BUILD TOGETHER</b></div>
                <div className="builder-folio__browser-body">
                  <div className="builder-folio__code"><span /><span /><span /><span /></div>
                  <div className="builder-folio__person">◕</div>
                </div>
              </div>
              <div className="builder-folio__plant builder-folio__plant--one">⌇</div>
              <div className="builder-folio__plant builder-folio__plant--two">⌇</div>
              <div className="builder-folio__ground">✳ &nbsp; ◌ &nbsp; ✳</div>
            </div>
          </div>

          <div className="builder-folio__spine" />

          <div className="builder-folio__page builder-folio__page--bottom">
            <p className="builder-folio__belief">Three things we strongly believe in</p>
            <div className="builder-folio__cards">
              <article><UsersRound /><span>Find your<br /><b>people</b></span></article>
              <article><Code2 /><span>Build in<br /><b>the open</b></span></article>
              <article><Sparkles /><span>Ship what<br /><b>matters</b></span></article>
            </div>
            <Link href="/signup" className="builder-folio__cta">Start building <ArrowUpRight /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
