#include<iostream>
using namespace std;

bool search(int arr[], int size, int key){
    for(int i=0; i<size; i++){
        if(arr[i]==key){
            return 1;
        }
    }
    return 0;
}

int main()
{
    int array[10]={65,10,2,1,90,67,45,17,43,18};
    int key;
    cout<<"What key to search: ";
    cin>>key;
    if(search(array, 10, key)){
        cout<<"Is present.";
    }
    else cout<<"NOT Present;";
    return 0;
}