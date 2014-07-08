##TODOS:

* Battles
    - See through that advanced battles work now:
        - continue adding battle advanced vids (imporving its ui feats) and verify it works to play. Then create finishing the battle

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
* edit profile only works from home page
* cant stop battlerequest playback in advanced mode.
* New fan notification, clicking leads to empty user..
* Notifications number never changes
* After register, if you want to edit profile, its a little buggy upon that save.



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
