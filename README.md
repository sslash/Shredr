##TODOS:

* battle detail
    - commenting
    - paging battles

* side-Widgets

* Leveling
* Badges

* Feed
    - battle comment
    - battle complete
    - fan
    - battle video
    * Later
        - Leveling
        - Scales
        - Theory things

* Searching and filtering
    - search battles

* Social functions
* Landing page
* hide playback buttons
* tags should be converted to lowercase upon save

// non importants
* restrict fans added multiple times
* on lookup battle, do the same, but if battle is done, update should be sync and battle is returned updated.

// bugs
* edit profile only works from home page
* cant stop battlerequest playback in advanced mode.
* New fan notification, clicking leads to empty user..
* Notifications number never changes
* After register, if you want to edit profile, its a little buggy upon that save.
* stopping battles and restarting isnt working
* Video playback in general is not working across browsers



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
