# Automated daily video run (scheduled task reads this)

Owner: Daniel. He does NOT review before posting — you are the quality and accuracy gate. If anything fails or a fact can't be verified, do not upload; email him.

1. Setup: repo at /home/claude/dray-x-finance-. `cd` there and run `bash tools/setup.sh`.
2. Pick the topic: read CHANNEL.md (format + accuracy rules + past videos), TOPICS.md (backlog), EPISODES.md (posted log), PERFORMANCE.md (latest "Apply next").
   Take the first unused backlog topic unless PERFORMANCE.md says otherwise. Slug = short lowercase name (e.g. theranos).
   Before writing, check the channel's latest uploads (Zapier YouTube find_video, channel_id UCkjJPV_cO6KI9ujVdd4tBDw, order date) so you never repeat a topic.
3. RESEARCH (mandatory): WebSearch + WebFetch at least 3 independent reputable sources (news agencies, court/regulator documents, major papers, Wikipedia only as a pointer).
   Check the CURRENT status (court cases, people, companies) as of today. Write episodes/<slug>/sources.md with every URL used.
4. Write episodes/<slug>/shots.py (copy the helper block from episodes/wirecard/shots.py). 1,350–1,900 words, 4–6 chapters, sourced numbers only, allegations as allegations.
   Also episodes/<slug>/thumb.json (see CHANNEL.md thumbnails) and package.json {"title","description","tags","pinned_comment"}.
   Title pattern: "<Topic> Explained: <hook with a number>" (≤ 70 chars). Description: 2-line hook, summary, chapters, sources note, "new money stories every day", 3 hashtags. 12–18 tags.
5. Frame check (ENGINE.md "Checking before the full render"): look at ~12 frames incl. every card type you used. Fix overflowing text, hidden faces, empty frames.
6. `bash tools/make.sh <slug>` (~30–45 min). Check out/<slug>/video.mp4: duration 8.5–14 min, extract 6 frames with ffmpeg and look at them, check work/<slug>/thumb_small.jpg is readable.
7. Commit episodes/<slug>/ + TOPICS.md (mark used) and push to main.
8. Host files on the orphan `media` branch (replaced every run):
   ```
   rm -rf /home/claude/media && mkdir /home/claude/media && cd /home/claude/media && git init -q -b media
   cp /home/claude/dray-x-finance-/out/<slug>/video.mp4 /home/claude/dray-x-finance-/out/<slug>/thumbnail.jpg .
   git add -A && git -c user.name=Claude -c user.email=noreply@anthropic.com commit -qm "media <slug>"
   git remote add origin https://github.com/didoko69/dray-x-finance- && git push -q -f origin media
   curl -sI https://raw.githubusercontent.com/didoko69/dray-x-finance-/media/video.mp4 | head -1   # must be 200 (wait ~10 s if 404)
   ```
9. Upload with Zapier YouTube upload_video using connection_id = the Dray x finance connection (see ZAPIER.md — NEVER the Divine survival connection):
   title, description, video=https://raw.githubusercontent.com/didoko69/dray-x-finance-/media/video.mp4, thumbnail=…/media/thumbnail.jpg,
   tags, privacy_status "public", category_id "27" (Education), made_for_kids "false", default_language "en", notify_subscribers "true".
   Verify the response channelId == UCkjJPV_cO6KI9ujVdd4tBDw. If the thumbnail didn't apply, use upload_video_thumbnail with the same connection_id.
10. Update EPISODES.md (date, slug, title, video id/URL) and push.
11. Email Daniel via Zapier Gmail to didoko289@gmail.com: subject "✅ Dray x finance: <title>", body = link + pinned comment text.
On failure: no upload; email "⚠️ Dray x finance video failed" with the reason.
