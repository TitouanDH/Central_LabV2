import datetime

from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.contrib.auth.models import User

from django.shortcuts import get_object_or_404, get_list_or_404

from .models import Dut,  Reservation, Link
from .serialiazers import DutSerializer, ReservationSerializer, LinkSerializer, UserSerializer

"""
Features : 

# login
# signup

# create a new reservation
# modify a reservation
# delete a reservation
# show list of reservation
# show reservation by User

# link Dut to reservation -> change banner
# unlink Dut to reservation -> change banner + clean Dut
# show list of Dut : available and reserved
# show Dut reserved by reserv

# Connect Link -> add service
# Disconnect Link -> remove the service
# Show list of connected Link per Dut
# show list of disconnected Link per Dut

"""

BVLAN = 4000
SERVICE = 4000


"""
Usage :

- Login and retreive the Token sent back
- Use the Token as the 'Authorization' Header

exemple:

Headers:
    Content-Type: application/json
    Authorization: Token <Token From Login>
Body:
    {}

"""



@api_view(['POST'])
def login(request):
    """
    {
        "username": "admin",
        "password": "admin123"
    }
    """
    user = get_object_or_404(User, username=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
    
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)
    return Response({"token": token.key, "user": serializer.data}, status=status.HTTP_202_ACCEPTED)


@api_view(['POST'])
def signup(request):
    """
    {
        "username": "test2",
        "password": "test123"
    }
    """
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username=request.data['username'])
        user.set_password(request.data['password'])
        user.save()
        token = Token.objects.create(user=user)
        serializer = UserSerializer(instance=user)
        return Response({"token": token.key, "user": serializer.data})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    """
    Content-Type: application/json
    Authorization: Token <Token From Login>
    {}
    """
    return Response("This is {}'s Auth Token".format(request.user.username), status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def welcome(request):
    api_urls = {
        "infos" : "This is the list of the differents fonctionnalities",
        "urls" : [
            "/login/",
            "/signup/",
            "/create_reservation/",
            "/delete_reservation/<str:pk>/",
            "/update_reservation/<str:pk>/",
            "/list_reservation/all/",
            "/view/stats/"
            "/list_reservation/",
            "/list_reservation/<str:pk>/",
            "/reserve/",
            "/release/",
            "/connect/",
            "/disconnect/",
            "/list_dut/all/",
            "/list_dut/?reserv=<id>",
            "/list_link/?dut=<id>",
            "/test_token/",
        ]
    }
    return Response(api_urls)


@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_reservation(request):

    if 'duration' in request.data:
        duration = request.data['duration']
        request.data['end'] = datetime.datetime.now() + datetime.timedelta(hours=int(duration))
        request.data.pop('duration')

    serializer = ReservationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"reservation": serializer.data}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_reservation(request, pk):
    reservation = get_object_or_404(Reservation, id=pk)
    if reservation.creator == request.user or request.user.is_staff is True:
        serializer = ReservationSerializer(instance=reservation)
        reservation.unlinkAll()
        reservation.delete()
        return Response({"reservation": serializer.data}, status=status.HTTP_200_OK)
    else:
        return Response({"detail": "reservation ownership is False."}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_reservation(request, pk):
    if 'duration' in request.data:
        duration = request.data['duration']
        request.data['end'] = datetime.datetime.now() + datetime.timedelta(hours=int(duration))
        request.data.pop('duration')

    serializer = ReservationSerializer(data=request.data)
    if serializer.is_valid():
        reservation = get_object_or_404(Reservation, id=pk)
        if reservation.creator == request.user or request.user.is_staff is True:
            reservation.end=serializer.data['end']
            reservation.creator=User.objects.get(id=serializer.data['creator'])
            reservation.name=serializer.data['name']
            reservation.purpose=serializer.data['purpose']

            reservation.save()
            serializer = ReservationSerializer(instance=reservation)
            return Response({"reservation": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "reservation ownership is False."}, status=status.HTTP_401_UNAUTHORIZED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def list_reservation_by_id(request, pk):
    reservation = get_object_or_404(Reservation, creator=pk)
    serializer = ReservationSerializer(instance=reservation)
    return Response({"reservation": serializer.data}, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def list_reservation_by_user(request):
    reservation = get_list_or_404(Reservation, creator=request.user)
    serializer = ReservationSerializer(instance=reservation, many=True)
    return Response({"reservation": serializer.data}, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAdminUser])
def list_all_reservation(request):
    reservations = Reservation.objects.all()
    serializer = ReservationSerializer(instance=reservations, many=True)
    return Response({"reservations": serializer.data}, status=status.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def reserve(request):
    """
    Structure
        {
            "reservations": [
                {
                    "reservation": 68,
                    "dut": 317
                },
                {
                    "reservation": 68,
                    "dut": 215
                }
            ]
        }
    """

    if 'reservations' in request.data:
        reservations = request.data['reservations']
        duts = []
        for item in reservations:
            if 'reservation' in item and 'dut' in item:
                dut = get_object_or_404(Dut, id=item['dut'])
                if dut.reserv is not None:
                    duts.append({"Fail" : "DUT {} already reserved.".format(dut.id)})
                    continue
                
                reservation = get_object_or_404(Reservation, id=item['reservation'])
                dut.link(reservation)
                duts.append(DutSerializer(instance=dut).data)

        return Response({"duts": duts}, status=status.HTTP_200_OK)

    return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def release(request):
    """
    Structure:
    {
        "duts": [
            {
                "dut": 419
            },
            {
                "dut": 676
            }
        ]
    }
    """
    if 'duts' in request.data:
        reserved = request.data['duts']
        duts = []
        for item in reserved:
            if 'dut' in item:
                dut = get_object_or_404(Dut, id=item['dut'])
                if dut.reserv is None:
                    duts.append({"Fail" : "DUT {} already released.".format(dut.id)})
                    continue
                
                dut.unlink()
                duts.append(DutSerializer(instance=dut).data)

        return Response({"duts": duts}, status=status.HTTP_200_OK)

    return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def list_dut_by_reservation(request):
    if 'reserv' in request.GET:
        reserv = request.GET['reserv']
        duts = get_list_or_404(Dut, reserv=reserv)
        serializer = DutSerializer(instance=duts, many=True)
        return Response({"duts": serializer.data}, status=status.HTTP_200_OK)
    return Response({"detail": "Param not valid."}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def list_dut_state(request):
    duts = Dut.objects.all()
    available = Dut.objects.filter(reserv=None)
    reserved = Dut.objects.exclude(reserv=None)

    available_serializer = DutSerializer(instance=available, many=True)
    reserved_serializer = DutSerializer(instance=reserved, many=True)

    return Response({"availables": available_serializer.data, "reserved": reserved_serializer.data}, status=status.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def connect(request):
    """
    Structure :
    {
        "links": [
            {
                "portA": 68,
                "portB": 419
            },
            {
                "portA": 68,
                "portB": 419
            }
        ]
    }
    """
    if 'links' in request.data:
        links = request.data['links']
        back = []
        for item in links:
            if 'portA' in item and 'portB' in item:
                linkA = get_object_or_404(Link, id=item['portA'])
                linkB = get_object_or_404(Link, id=item['portB'])

                if linkA.dut.reserv == None or linkB.dut.reserv == None:
                    back.append({"Fail" : "One of the DUTs is not reserved."})
                    continue

                if linkA.dut.reserv.creator != request.user or linkB.dut.reserv.creator != request.user:
                    back.append({"Fail" : "One of the DUTs is not yours."})
                    continue

                global BVLAN
                global SERVICE

                if BVLAN >= 4002:
                    BVLAN = 4000
                else:
                    BVLAN += 1

                if SERVICE >= 5000:
                    SERVICE = 4000
                else:
                    SERVICE += 1
                
                if linkA.setService(SERVICE, BVLAN) and linkB.setService(SERVICE, BVLAN):
                    back.append({"Success" : "Connection between {} {} and {} {}".format(linkA.dut, linkA.dut_port, linkB.dut, linkB.dut_port)})
                else:
                    back.append({"Fail" : "Tunnel not created"})
            else:
                back.append({"Fail" : "Wrong formating of the port"})


        return Response({"duts": back}, status=status.HTTP_200_OK)

    return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)



@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def disconnect(request):
    """
    Structure :
    {
        "links": [
            {
                "portA": 68,
                "portB": 419
            },
            {
                "portA": 68,
                "portB": 419
            }
        ]
    }
    """
    if 'links' in request.data:
        links = request.data['links']
        back = []
        for item in links:
            if 'portA' in item and 'portB' in item:
                linkA = get_object_or_404(Link, id=item['portA'])
                linkB = get_object_or_404(Link, id=item['portB'])

                if linkA.dut.reserv == None or linkB.dut.reserv == None:
                    back.append({"Fail" : "One of the DUTs is not reserved."})
                    continue

                if linkA.dut.reserv.creator != request.user or linkB.dut.reserv.creator != request.user:
                    back.append({"Fail" : "One of the DUTs is not yours."})
                    continue

                if linkA.dut == linkB.dut:
                    if linkA.deleteService() or linkB.deleteService():
                        back.append({"Success" : "Disconnection between {} {} and {} {}".format(linkA.dut, linkA.dut_port, linkB.dut, linkB.dut_port)})
                elif linkA.deleteService() and linkB.deleteService():
                    back.append({"Success" : "Disconnection between {} {} and {} {}".format(linkA.dut, linkA.dut_port, linkB.dut, linkB.dut_port)})
                else:
                    back.append({"Fail" : "Tunnel not removed"})
            else:
                back.append({"Fail" : "Wrong formating of the port"})

        return Response({"duts": back}, status=status.HTTP_200_OK)

    return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def list_link_by_dut(request):
    if 'dut' in request.GET:
        dut = get_object_or_404(Dut, id=request.GET['dut'])
        available_links = Link.objects.filter(dut=dut, service=None)
        connected_links = Link.objects.filter(dut=dut).exclude(service=None)
        available_serializer = LinkSerializer(instance=available_links, many=True)
        connected_serializer = LinkSerializer(instance=connected_links, many=True)
        return Response({"available": available_serializer.data, "connected": connected_serializer.data}, status=status.HTTP_200_OK)
    return Response({"detail": "Param not valid."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def stats(request):
    return Response({'users' : len(User.objects.all()), 'duts' : len(Dut.objects.all()), 'reservations' : len(Reservation.objects.all())}, status=status.HTTP_200_OK)