##TODOS:

* Edit profile (images at least) CONTINUE IN EDIT PROFILE VIEW IN NAV

* Battles
    - See through that advanced battles work now

* user things in navbar
* Promotions
* Searching
* Social functions
* Landing page
* hide playback buttons

// non importants
* restrict fans added multiple times
* on lookup battle, do the same, but if battle is done, update should be sync and battle is returned updated.

// bugs
* cant stop battlerequest playback in advanced mode.
* New fan notification, clicking leads to empty user..
* Notifications number never changes



BATTLE THINGS
finish battles with winners:

    Battles should have a finished time. When on of the
    compellors logs in, system will check all their ongoing battles
    to see if any of them has timed out. In that case, the winner
    will be chosen, and battle set to finished. Both compellors
    will be notified. In the future, this will instead be done by
    a cronjob or similar

    WAYS TO WIN
    - Highest Vote
    - Not Reply

    PROMOTIONS
    - battle compellors are asked to vote on other battles.
    This leads those other battles' compellors to get current
    battle in their feed, in which they should vote on for extra
    credit. Extra credit leads to more XP and possibly new badges
