'use client';

import React, { useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';

/**
 * InfoView Component
 * Help and information screen
 */
export const InfoView: React.FC = () => {
  const { infoViewOpen, closeInfoView } = useApp();
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation and scrolling
  useEffect(() => {
    if (!infoViewOpen || !contentRef.current) return;

    const content = contentRef.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!content) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          content.scrollBy({ top: 50, behavior: 'smooth' });
          break;
        case 'ArrowUp':
          e.preventDefault();
          content.scrollBy({ top: -50, behavior: 'smooth' });
          break;
        case 'PageDown':
          e.preventDefault();
          content.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
          break;
        case 'PageUp':
          e.preventDefault();
          content.scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' });
          break;
        case 'Home':
          e.preventDefault();
          content.scrollTo({ top: 0, behavior: 'smooth' });
          break;
        case 'End':
          e.preventDefault();
          content.scrollTo({ top: content.scrollHeight, behavior: 'smooth' });
          break;
      }
    };

    // Also handle wheel events for touchpad scrolling
    const handleWheel = (e: WheelEvent) => {
      if (!content) return;
      // Allow native scrolling behavior
      // Don't prevent default to enable smooth touchpad scrolling
    };

    window.addEventListener('keydown', handleKeyDown);
    content.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      content.removeEventListener('wheel', handleWheel);
    };
  }, [infoViewOpen]);

  if (!infoViewOpen) {
    return null;
  }

  return (
    <div className="info-view">
      {/* Navigation Bar */}
      <nav className="navigation">
        <button
          className="navigation-button done-button"
          onClick={closeInfoView}
          aria-label="Done"
        >
          Done
        </button>

        <h1 className="navigation-title">
          PayCoffee
        </h1>

        <a
          href="https://www.aipdroma.it/dona-ora/"
          target="_blank"
          rel="noopener noreferrer"
          className="navigation-button donate-button"
          onClick={(e) => {
            // Open in new tab
            e.preventDefault();
            window.open(e.currentTarget.href, '_blank');
          }}
        >
          Donate
        </a>
      </nav>

      <div
        ref={contentRef}
        className="info-view-content"
      >
        <h2>Features</h2>

        <p>
          If you often get bar for coffee with the same group of friends for breakfast or after launch, the <em>PayCoffee</em> app answer to the question: <em>Who pays the coffees today?</em>
        </p>

        <p>The logic is simple:</p>

        <ul>
          <li>
            for each coffee you get you lose one credit
          </li>
          <li>
            for each coffe you pay you get one credit
          </li>
          <li>
            among those who get the coffee, the app evaluate, for paying the coffees, who has the lower number of credits or with the same credits but older last payment date
          </li>
          <li>
            a random choice is made if credits and last payment date are the same
          </li>
        </ul>

        <p>Note that if you get a coffee and you pay N coffees, including your own coffee, then you get (N-1) credits.</p>

        <p>You can always select manually who pays the coffees.</p>

        <h2>Usage</h2>

        <p>The usage is simple:</p>

        <ul>
          <li>
            add new names to the list with <strong>+</strong> left button
          </li>
          <li>
            select/unselect who get a coffee with a single tap on related list entries
          </li>
          <li>
            to get who pays the coffees press the central <em>coffee</em> button, confirming with <em>OK</em> button the app selection or using <em>Cancel</em> to not confirm
          </li>
          <li>
            to select manually who pays the coffees use a double tap on related list entry, confirming with <em>OK</em> button
          </li>
          <li>
            to edit or to export/import the list use the <em>Edit</em> button
          </li>
        </ul>

        <p>You can learn app usage with the four default example entries, deleting them when you finished before creating your own list.</p>

        <p>Only one person at a time on the list can be the "master" of the list and therefore the owner of its updates and sharing with others for alignment and backup.</p>

        <h2>Interface</h2>

        <p>The user interface of <em>PayCoffee</em> app contains only one screen with:</p>

        <ul>
          <li>
            a list of names with related credits and last payment date
          </li>
          <li>
            a bottom toolbar having three buttons:
            <ul>
              <li>
                the first one (<strong>+</strong>) to add a new person to the list, each identified by a unique name and having on the left a colored coin icon:
                <ul>
                  <li>
                    <em>yellow</em> if the number of credits is equal to zero (the default value when add a new person to the list)
                  </li>
                  <li>
                    <em>red</em> if the number of credits is less than zero
                  </li>
                  <li>
                    <em>green</em> if the number of credits is greater than zero
                  </li>
                </ul>
              </li>
              <li>
                the second one to evaluate who pay the coffees after selecting who get a coffee
              </li>
              <li>
                the third one, a checkbox, to select/unselect all names of the list
              </li>
            </ul>
          </li>
          <li>
            an <em>Edit</em> button on the top right to remove a person from the list or sort the list, manually or automatically by credits and last payment date using button on right side of bottom toolbar
          </li>
          <li>
            an <em>Actions</em> button on the top right, to use when <em>Edit</em> is selected, in order to:
            <ul>
              <li>
                <em>Export</em> list to <em>clipboard</em>
              </li>
              <li>
                <em>Export</em> list to CSV <em>file</em>
              </li>
              <li>
                <em>Import</em> list from <em>clipboard</em>
              </li>
              <li>
                <em>Reset</em> to default list
              </li>
            </ul>
          </li>
        </ul>

        <p>For export/import through <em>copy & paste</em> you could use, for example, the predefined text editor app on your device.</p>

        <h2>Example</h2>

        <p>With the predefined list:</p>

        <ul>
          <li>
            Tony has 1 credits and last payment date is 2012-10-28
          </li>
          <li>
            Peter has 2 credits
          </li>
          <li>
            Phil has -3 credits and last payment date is 2012-10-18
          </li>
          <li>
            Mike has 0 credits
          </li>
        </ul>

        <p>If today is 2012-10-29, all get a coffee and you select Peter manually for paying the 4 coffees you get:</p>

        <ul>
          <li>
            Tony has 0 credits and last payment date is 2012-10-28
          </li>
          <li>
            Peter has 3 credits and last payment date is 2012-10-29
          </li>
          <li>
            Phil has -4 credits and last payment date is 2012-10-18
          </li>
          <li>
            Mike has -1 credits
          </li>
        </ul>

        <p>If tomorrow is 2012-10-30, only Tony, Peter and Mike get a coffee and you confirm Mike for paying the coffees (evaluated by the app because has the same credits of Tony but its payment date is older) you get:</p>

        <ul>
          <li>
            Tony has -1 credits and last payment date is 2012-10-28
          </li>
          <li>
            Peter has 1 credits and last payment date is 2012-10-29
          </li>
          <li>
            Phil has -4 credits and last payment date is 2012-10-18
          </li>
          <li>
            Mike has 2 credits and last payment date is 2012-10-30
          </li>
        </ul>

        <h2>Support</h2>

        <p>
          For support contact <a href="mailto:davide6169@gmail.com" style={{ color: '#007aff' }}>davide6169@gmail.com</a>
        </p>

        <p>
          If you like this app please "pay a coffee" to AIPD association in Rome using "Donate" button to go directly to their website to make a donation... :-)
        </p>

      </div>
    </div>
  );
};
