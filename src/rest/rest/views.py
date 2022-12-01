from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json, logging, os
from pymongo import MongoClient
from bson.objectid import ObjectId

mongo_uri = 'mongodb://' + os.environ["MONGO_HOST"] + ':' + os.environ["MONGO_PORT"]
db = MongoClient(mongo_uri)['test_db']

todo_list = db['todo_list']

class TodoListView(APIView):

    def get(self, request):
        # Implement this method - return all todo items from db instance above.
        res = [{
                "id": str(todo["_id"]),                 # converted to string since Objectid isn't json serializable
                "title": todo["title"]
                } for todo in todo_list.find()]
                
        return Response(res, status=status.HTTP_200_OK)
        
    def post(self, request):
        # Implement this method - accept a todo item in a mongo collection, persist it using db instance above.
        title = request.data.get('title')
        if not title:
            return Response({'detail': 'title is required'}, status.HTTP_400_BAD_REQUEST)

        new_todo_id = todo_list.insert({               # returns ObjectId
            "title": title
        })
        return Response({
            "id": str(new_todo_id),
            "title": title
        }, status = status.HTTP_201_CREATED)

class TodoDeleteView(APIView):
    
    def delete(self, request, pk):

        todo_list.delete_one({
            "_id": ObjectId(pk)
        })

        return Response({
            "detail": "Successfully deleted"}, status = status.HTTP_200_OK)

