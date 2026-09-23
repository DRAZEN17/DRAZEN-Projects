import 'package:flutter/material.dart';
import '../models/comment.dart';

class CommentThread extends StatefulWidget {
  final int postId;
  const CommentThread({super.key, required this.postId});

  @override
  State<CommentThread> createState() => _CommentThreadState();
}

class _CommentThreadState extends State<CommentThread> {
  final List<Comment> _comments = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    // In real app, fetch comments from API using postId
    // For now, show placeholder
    setState(() => _loading = false);
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return const Center(child: CircularProgressIndicator());
    return Column(
      children: _comments.map((c) => _CommentTile(comment: c)).toList(),
    );
  }
}

class _CommentTile extends StatelessWidget {
  final Comment comment;
  const _CommentTile({required this.comment});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(left: comment.parentId != null ? 24.0 : 0),
      child: ListTile(
        title: Text(comment.authorUsername),
        subtitle: Text(comment.body),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('${comment.score}'),
            IconButton(icon: const Icon(Icons.reply), onPressed: () {}),
          ],
        ),
      ),
    );
  }
}